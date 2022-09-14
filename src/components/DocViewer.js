import { useState, useEffect } from "react";

export default function DocViewer({closeCurrentDoc, currentDoc}){
    const [editing, setEditing] = useState(false);
    return (
        <>
          <div>
              <button onClick={closeCurrentDoc}>Close Doc</button>
              <button onClick={() => setEditing(!editing)}>Edit Doc</button>
          </div>
          <Note doc={currentDoc} editing={editing}/>
        </>
      );
}

function Note({doc, editing}){
    const paragraphs = Object.keys(doc).reduce((arr, key) => {
        if(key !== "type"){
            return [...arr, doc[key]];
        } else {
            return arr;
        }
    }, []);
    const paragraphElements = paragraphs.map(p => (<p>{p}</p>))
    return(
        <div className="doc-editor">
            {paragraphElements}
            {editing && <NoteEditor paragraphs={paragraphs} />}
        </div>
    )
}

function NoteEditor({ paragraphs }){
    const [value, setValue] = useState('');

    useEffect(() => {
        const text = paragraphs.reduce((cur, p) => {
            return cur + p;
        }, '');
        setValue(text);
    }, [])

    function handleChange(event) {
        setValue(event.target.value);
    }

    return(
        <div>
            <textarea className="doc-editor--input" value={value} onChange={handleChange} />
        </div>
    )
}