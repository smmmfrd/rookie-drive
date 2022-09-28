import { useState, useEffect, useRef, forwardRef, useCallback } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { buildNewMeme } from "./components/MemeGenerator";
import DocViewer from "./components/DocViewer";

async function getLandingDocs(){
  console.log('fetching landing from firestore');

  const docRef = doc(db, 'landing', 'example');

  const docSnap = await getDoc(docRef);

  let docsData = docSnap.data();
  
  return docsData;
}

async function getUserDocs(userId){
  console.log('fetching user\'s docs');
  const userDocRef = doc(db, 'drive', userId);

  const docSnap = await getDoc(userDocRef);

  let data = {};
  if(docSnap.exists()){
    data = docSnap.data();
  } else {
    await setDoc(doc(db, 'drive', userId), data);
  }
  return data;
}

async function getFieldData(id, docName){
  console.log('fetching a field from firestore');
  const fullData = await (id.length > 0 ? getUserDocs(id) : getLandingDocs());
  const field = fullData[docName];
  return field;
}

async function setFieldData(id, docName, docValue){
  console.log('Changing doc');
  let change = {};
  change[docName] = docValue;
  if(id.length > 0){
    const docRef = doc(db, 'drive', id);
    updateDoc(docRef, change);
  } else {
    // TODO - get rid of this once landing examples are finished
    const docRef = doc(db, 'landing', 'example');
    updateDoc(docRef, change);
  }
}

async function deleteFieldData(id, docName){
  console.log('deleting doc');
  var docRef;
  if(id.length > 0){
    docRef = doc(db, 'drive', id);
  } else {
    // TODO - get rid of this once landing examples are finished
    docRef = doc(db, 'landing', 'example');
  }
  await updateDoc(docRef, {
    [docName]: deleteField()
  });
}

export default function App() {
  const [currentDocName, setCurrentDocName] = useState('');
  const [currentDoc, setCurrentDoc] = useState({});
  const [docNames, setDocNames] = useState([]);

  const [user] = useAuthState(auth);
  const [currentId, setCurrentId] = useState('');
  const [loading, setLoading] = useState(false);

  const updateDocNames = useCallback(async (uid = currentId) => {
    setLoading(true);
    const res = await (uid.length > 0 ? getUserDocs(uid) : getLandingDocs())
    setDocNames(Object.keys(res)
      .sort()
      .map(docName => docName)
    );
    setLoading(false);
  }, [currentId]);

  useEffect(() => {
    if(user !== null) {
      console.log('signed in clicked');
      // Signed in
      setCurrentId(user.uid);
      updateDocNames(user.uid);
    } else {
      // Display landing
      console.log('signed out clicked');
      setCurrentId('');
      updateDocNames('');
    }
  }, [user, updateDocNames])

  const newDocModal = useRef();

  async function addNewDoc(newDocName, newDocType){
    var newDoc = { type: newDocType }
    if(newDocType === 'meme'){
      newDoc = await buildNewMeme();
      console.log('you meant meme?', newDoc);
    }

    await setFieldData(currentId, newDocName, newDoc);
    await updateDocNames();
    closeNewDoc();
  }

  async function deleteCurrentDoc(){
    await deleteFieldData(currentId, currentDocName);
    await updateDocNames();
    closeCurrentDoc();
  }

  function docSelected(docName){
    setCurrentDocName(docName);
    getFieldData(currentId, docName).then(res => setCurrentDoc(res));
  }

  function closeCurrentDoc(){
    setCurrentDocName('');
    setCurrentDoc({});
  }

  function editCurrentDoc(newDoc){
    setFieldData(currentId, currentDocName, newDoc)
      .then(closeCurrentDoc());
  }

  const docElements = docNames.map(docName => (
    <div key={docName} className="doc-shortcut"
      onClick={() => docSelected(docName)}>
      <h2>{docName}</h2>
    </div>
  ));

  function openNewDoc(){
    newDocModal.current.showModal();
  }

  function closeNewDoc(){
    newDocModal.current.close();
  }

  return (
    <>
      <nav>
          <h1>Rookie Drive</h1>
          {currentDoc.type === undefined &&
            <div>
              <button onClick={openNewDoc}>+ New File</button>
              {user === null ? <SignIn /> : <SignOut />}
            </div>
          }
      </nav>

      <NewDocModal 
        ref={newDocModal} 
        addNewDoc={addNewDoc} 
        closeNewDoc={closeNewDoc} 
      />

      {currentDoc.type !== undefined ? 
        <DocViewer 
          currentDoc={currentDoc}
          closeCurrentDoc={closeCurrentDoc}
          docEdited={editCurrentDoc}
          deleteDoc={deleteCurrentDoc}
        />
      : (
        loading ? <h2>Loading</h2> :
        <div className="doc-display">{docElements}</div>
      )}
    </>
  );
}

function SignIn(){
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <button onClick={signInWithGoogle}>Sign In</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

const NewDocModal = forwardRef((props, ref) => {
  const {addNewDoc, closeNewDoc } = props;
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('note');

  function handleSubmit(event){
    event.preventDefault();
    
    if(docName.length === 0) {
      return;
    }

    addNewDoc(docName, docType);
  }

  return (
    <dialog ref={ref} className="new-doc--dialog">
      <h1>Create New Document</h1>
      <form onSubmit={(e) => handleSubmit(e)} className="new-doc--form">
        <button type="button" onClick={closeNewDoc}>&times;</button>
        <label>
          Doc Type:
          <select value={docType} onChange={((e) => setDocType(e.target.value))}>
            <option value="note">Note</option>
            <option value="todo">Todo</option>
            <option value="rand">Random List</option>
            <option value="meme">Meme</option>
          </select>
        </label>
        <label>
          Title:
          <input type='text' 
            value={docName}
            onChange={(event) => setDocName(event.target.value)}
          />
        </label>
        <button type="submit">Add Doc</button>
      </form>
    </dialog>
  );
})