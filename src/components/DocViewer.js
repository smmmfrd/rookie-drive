export default function DocViewer({closeCurrentDoc, currentDoc}){
    return (
        <>
          <button onClick={closeCurrentDoc}>Close Doc</button>
          <button>Edit Doc</button>
          <Note doc={currentDoc}/>
        </>
      );
}

function Note({doc}){
  const paragraphs = Object.keys(doc).filter(key => key !== "type");
  const paragraphElements = paragraphs.map(p => (<p>{doc[p]}</p>))
  return(
    <div>
      {paragraphElements}
    </div>
  )
}