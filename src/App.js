import { firestore } from "./firebase";

import Navbar from "./components/Navbar";

async function getLanding(){
  const landing = await firestore.collection('landing').doc('example').get();
  const data = landing.data();
  return data;
}

export default function App() {
  getLanding().then(res => console.log(res));
  return (
    <div className="App">
      <Navbar />
    </div>
  );
}