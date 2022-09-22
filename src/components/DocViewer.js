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
        setCurrent(choices[Math.floor(Math.random() * choices.length)]);
    }

    const editElements = choices.map((c, index) => (
        <div key={`r${index}`}><input value={c} onChange={(e) => handleInput(e, index)}/></div>
    ));

    function handleInput(event, index){
        setChoices(choices.map((t, i) => {
            if(i === index){
                return event.target.value;
            } else {
                return t;
            }
        }));
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
                
                </div>
            }
        </div>
    )
}