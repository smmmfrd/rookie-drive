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
    const paragraphElements = paragraphs.map((p, index) => (
        <p key={index}>
            {p}
        </p>
    ));
    return(
        <div className="doc-editor">
            {paragraphElements}
            {editing && <NoteEditor paragraphs={paragraphs} />}
        </div>
    )
}

function NoteEditor({ paragraphs }){
    const [value, setValue] = useState('');
    const [areaHeight, setAreaHeight] = useState(0);

    useEffect(() => {
        const text = paragraphs.reduce((cur, p) => {
            return cur + p;
        }, '');
        setValue(text);
        setAreaHeight(calcTextAreaHeight(text));
    }, [])

    function calcTextAreaHeight(value) {
        let lines = value.split('\n');
        let numberOfLineBreaks = lines.length;
        let numberOfLongLines = lines.reduce((total, line) => {
            return Math.floor(line.length / 40) + total;
        }, 0)
        
        // min-height + lines x line-height + padding + border
        let newHeight = 20 + (numberOfLineBreaks + numberOfLongLines) * 20 + 2;
        return newHeight;
    }

    function handleChange(event) {
        setValue(event.target.value);
        setAreaHeight(calcTextAreaHeight(event.target.value));
    }

    return(
        <div>
            <textarea
                style={{height:`${areaHeight}px`}}
                className="doc-editor--input"
                value={value}
                onChange={handleChange}
                cols={40}
            />
        </div>
    )
}