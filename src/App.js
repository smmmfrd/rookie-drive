import { useState, useEffect, useRef } from "react";
import { firestore } from "./firebase";

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

export default function App() {
  const currentDocName = useRef('');
  const [currentDoc, setCurrentDoc] = useState({});
  const [docNames, setDocNames] = useState([]);

  useEffect(() => {
    getLandingDocs().then(res => setDocNames(Object.keys(res).map(docName => docName)));
  }, []);

  function docSelected(docName){
    currentDocName.current = docName;
    getFieldData(docName).then(res => setCurrentDoc(res));
  }

  function closeCurrentDoc(){
    console.log('closing doc.')
    currentDocName.current = '';
    setCurrentDoc({});
  }

  function currentDocEdited(newDoc){
    setFieldData(currentDocName.current, newDoc)
      .then(closeCurrentDoc());
  }

  const docElements = docNames.map(docName => (
    <div key={docName} className="doc-shortcut"
      onClick={() => docSelected(docName)}>
      <h2>{docName}</h2>
    </div>
  ));

  return (
    <>
      <Navbar />
      {currentDoc.type !== undefined ? 
        <DocViewer currentDoc={currentDoc} closeCurrentDoc={closeCurrentDoc} docEdited={currentDocEdited}/>
      : (<div className="doc-display">{docElements}</div>)}
    </>
  );
}