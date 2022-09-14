import { useState, useEffect } from "react";
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

export default function App() {
  const [currentDoc, setCurrentDoc] = useState({});
  const [docNames, setDocNames] = useState([]);

  useEffect(() => {
    getLandingDocs().then(res => setDocNames(Object.keys(res).map(docName => docName)));
  }, []);

  function docSelected(docName){
    getFieldData(docName).then(res => setCurrentDoc(res));
  }

  function closeCurrentDoc(){
    setCurrentDoc({});
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
        <DocViewer currentDoc={currentDoc} closeCurrentDoc={closeCurrentDoc} />
      : (<div className="doc-display">{docElements}</div>)}
    </>
  );
}