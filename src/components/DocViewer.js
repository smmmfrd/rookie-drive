import { useState, useRef, useEffect } from "react";

import Note from "./Note";
import Todo from "./Todo";

export default function DocViewer({closeCurrentDoc, currentDoc, docEdited, deleteDoc}){
    const [changed, setChanged] = useState(false);
    const [editing, setEditing] = useState(false);

    const changedDoc = useRef({});

    function handleDocChange(newDoc){
        changedDoc.current = newDoc;
        if(!changed) {
            setChanged(true);
        }
    }

    function handleClose(){
        if(changed){
            docEdited(changedDoc.current);
        } else {
            closeCurrentDoc();
        }
    }

    const customProps = {
        doc: currentDoc,
        editing: editing,
        docChange: handleDocChange
    }

    const docDisplay = () => {
        switch(currentDoc.type){
            case 'note': 
                return <Note {...customProps}/>;
            case 'todo': 
                return <Todo {...customProps}/>;
            case 'rand': 
                return <RandomDraw {...customProps}/>;
            default:
                return null;
        }
    }

    return (
        <>
            <div>
                <button onClick={handleClose}>{changed ? 'Save and ' : ''}Close Doc</button>
                <button onClick={() => setEditing(!editing)}>{editing ? "Close Editor" : "Edit Doc"}</button>
                <button onClick={deleteDoc}>Delete Doc</button>
            </div>
            { docDisplay() }
        </>
    );
}

function RandomDraw({doc, editing, docChange}){
    const [choices, setChoices] = useState([]);
    const [current, setCurrent] = useState('');

    function buildState(d = doc){
        let newChoices = [];
        Object.keys(d)
            .sort()
            .forEach(key => {
                if(key !== 'type'){
                    newChoices.push(d[key])
                }
            });
        setChoices(newChoices);
    }

    useEffect(() => {
        buildState();
    }, []);

    const listElements = choices.map((c, index) => {
        return (
            <p key={index}>
                {c}
            </p>
        )
    })

    function pickRandom(){
        let currentIndex = choices.indexOf(current);
        let randIndexes = choices.reduce((arr, cur, index) => {
            return index !== currentIndex ? [...arr, index] : arr;
        }, [])
        let newIndex = randIndexes[Math.floor(Math.random() * randIndexes.length)]
        setCurrent(choices[newIndex]);
    }

    const editElements = choices.map((c, index) => (
        <div key={`r${index}`}><input value={c} onChange={(e) => handleInput(e, index)}/><button onClick={() => handleRemove(index)}>&times;</button></div>
    ));

    function handleInput(event, index){
        var newChoices = choices.map((t, i) => {
            if(i === index){
                return event.target.value;
            } else {
                return t;
            }
        })
        setChoices(newChoices);

        var newDoc = {type: 'rand'};
        newChoices.forEach((c, index) => newDoc[`r${index}`] = c);
        docChange(newDoc);
    }

    function handleRemove(index){
        setChoices(prev => {
            return prev.filter((r, i) => {
                return i !== index;
            })
        })
    }

    function handleAdd(){
        setChoices(prev => {
            return [...prev, ""];
        });
    }

    return (
        <div className="doc-editor">
            <div className="doc-editor--display">
                {listElements}
                <div>
                    {current.length > 0 && <h1>{current}</h1>}
                    <button onClick={pickRandom}>Pick {current.length > 0 ? "Another" : "Random" }</button>
                </div>
            </div>
            {editing && 
                <div className="doc-editor--input-container">
                    {editElements}
                    <p><button onClick={handleAdd}>Add Choice</button></p>
                </div>
            }
        </div>
    )
}