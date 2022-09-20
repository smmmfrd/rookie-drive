import { useState, useEffect, useRef, forwardRef } from "react";
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

  async function addNewDoc(newDocName, newDocType){
    await setFieldData(newDocName, { type: newDocType });
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
      : (<div className="doc-display">{docElements}</div>)}
    </>
  );
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
            {/* <option value="rand">Random List</option>
            <option value="quiz">Quiz</option> */}
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