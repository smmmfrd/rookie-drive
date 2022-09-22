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
                if(key === 'current'){
                    setCurrent(d[key]);
                } else if(key !== 'type'){
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
            <div key={index}>
                <p>{c}</p>
            </div>
        )
    })

    return (
        <div className="doc-editor">
            <div className="doc-editor--display">{listElements}</div>
        </div>
    )
}