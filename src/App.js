import { useState, useEffect } from "react";
import { firestore } from "./firebase";

import Navbar from "./components/Navbar";

async function getLandingDocs(){
  console.log('fetching from firestore');
  const landingDoc = await firestore.collection('landing').doc('example').get();
  const data = landingDoc.data();
  return(Object.keys(data).map(docName => docName));
}

export default function App() {
  const [docNames, setDocNames] = useState([]);

  useEffect(() => {
    getLandingDocs().then(res => setDocNames(res));
  }, []);
  
  const docElements = docNames.map(docName => (
    <div key={docName} className="doc-shortcut">
      <h2>{docName}</h2>
    </div>
  ));

  return (
    <div className="App">
      <Navbar />
      <div className="doc-display">
        {docElements}
      </div>
    </div>
  );
}