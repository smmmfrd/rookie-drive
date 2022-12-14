import { useState, useEffect, useCallback } from "react";
import DocDisplay from "./DocDisplay";

export default function Note({doc, editing, docChange}){
    const [paragraphs, setParagraphs] = useState([]);

    const buildParagraphs = useCallback(
        (d = doc) => {
            setParagraphs(Object.keys(d)
                .sort() // Need this because firestore mangles the keys
                .reduce((arr, key) => {
                if(key !== "type"){
                    return [...arr, d[key]];
                } else {
                    return arr;
                }
            }, []));
        }
    , [doc]);

    useEffect(() => {
        buildParagraphs();
    }, [buildParagraphs]);

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
        docChange(newDoc);
    }

    return(
        <DocDisplay 
            docElement={paragraphElements}
            editing={editing}
            editElements={<NoteEditor paragraphs={paragraphs} handleEdit={handleEdit}/>}
        />
    )
}

function NoteEditor({ paragraphs, handleEdit }){
    const [value, setValue] = useState('');
    const [areaHeight, setAreaHeight] = useState(0);

    useEffect(() => {
        const text = paragraphs.reduce((cur, p, currentIndex) => {
            return cur + p + (currentIndex !== paragraphs.length - 1 ? '\n' : '');
        }, '');
        setValue(text);
        setAreaHeight(calcTextAreaHeight(text));
    }, [paragraphs])

    function calcTextAreaHeight(value) {
        let lines = value.split('\n');
        let numberOfLineBreaks = lines.length;
        let numberOfLongLines = lines.reduce((total, line) => {
            return Math.floor(line.length / 40) + total;
        }, 0)
        
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
        <textarea
            style={{height:`${areaHeight}px`}}
            className="doc-editor--input"
            value={value}
            onChange={handleChange}
            maxLength="300"
            cols={40}
        />
    )
}
