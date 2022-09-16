import { useState, useEffect, useRef } from "react";
import { firestore } from "./firebase";
import { updateDoc, deleteField } from "firebase/firestore";

import Navbar from "./components/Navbar";
import DocViewer from "./components/DocViewer";

async function getLandingDocs(){
  console.log('fetching landing from firestore');
  const landingDoc = await firestore.collection('landing').doc('example').get();
  const data = landingDoc.data();
  return data;
}

async function getFieldData(docName){
  console.log('fetching a field from firestore');
  const fullData = await getLandingDocs();
  const field = fullData[docName];
  return field;
}

async function setFieldData(docName, docValue){
  console.log('Changing doc');
  let change = {};
  change[docName] = docValue;
  await firestore.collection('landing').doc('example').update(change);
}

async function deleteDoc(docName){
  const docRef = firestore.collection('landing').doc('example');
  await updateDoc(docRef, {
    [docName]: deleteField()
  });
}

export default function App() {
  // const currentDocName = useRef('');
  const [currentDocName, setCurrentDocName] = useState('');
  const [currentDoc, setCurrentDoc] = useState({});
  const [docNames, setDocNames] = useState([]);

  const newDocModal = useRef();

  useEffect(() => {
    updateDocNames();
  }, []);

  async function updateDocNames(){
    getLandingDocs().then(res => setDocNames(Object.keys(res)
      .sort()
      .map(docName => docName)
    ));
  }

  function docSelected(docName){
    setCurrentDocName(docName);
    getFieldData(docName).then(res => setCurrentDoc(res));
  }

  function closeCurrentDoc(){
    setCurrentDocName('');
    setCurrentDoc({});
  }

  function editCurrentDoc(newDoc){
    setFieldData(currentDocName, newDoc)
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

  async function addNewDoc(event){
    event.preventDefault();
    await setFieldData(currentDocName, { type: 'note' });
    await updateDocNames();
    closeNewDoc();
  }

  async function deleteCurrentDoc(){
    await deleteDoc(currentDocName);
    await updateDocNames();
    closeCurrentDoc();
  }

  return (
    <>
      <Navbar newFile={openNewDoc} />
      <dialog ref={newDocModal}>
        <form onSubmit={addNewDoc}>
          <button onClick={closeNewDoc}>x</button>
          <label>
            Title:
            <input type='text' 
              value={currentDocName}
              onChange={(event) => setCurrentDocName(event.target.value)}
            />
          </label>
          <button type="submit">Add Doc</button>
        </form>
      </dialog>
      {currentDoc.type !== undefined ? 
        <DocViewer 
          currentDoc={currentDoc}
          closeCurrentDoc={closeCurrentDoc}
          docEdited={editCurrentDoc}
          deleteDoc={deleteCurrentDoc}
        />
      : (<div className="doc-display">{docElements}</div>)}
    </>
  );
}