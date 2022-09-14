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
    const [paragraphs, setParagraphs] = useState([]);

    useEffect(() => {
        buildParagraphs();
    }, [])

    function buildParagraphs(d = doc){
        setParagraphs(Object.keys(d).reduce((arr, key) => {
            if(key !== "type"){
                return [...arr, d[key]];
            } else {
                return arr;
            }
        }, []));
    }

    const paragraphElements = paragraphs.map((p, index) => (
        <p key={index}>
            {p}
        </p>
    ));

    function handleEdit(newText){
        var newDoc = { type: 'note' }
        let paras = newText.split('\n');
        paras.forEach((p, index) => newDoc[`p${index + 1}`] = p);
        
        buildParagraphs(newDoc);
    }

    return(
        <div className="doc-editor">
            <div className="doc-editor--display">{paragraphElements}</div>
            {editing && <NoteEditor paragraphs={paragraphs} handleEdit={handleEdit}/>}
        </div>
    )
}

function NoteEditor({ paragraphs, handleEdit }){
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
        let text = event.target.value;

        setValue(text);
        setAreaHeight(calcTextAreaHeight(text));
        handleEdit(text);
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