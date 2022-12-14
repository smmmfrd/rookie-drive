import { useState, useRef } from "react";

import Note from "./Note";
import Todo from "./Todo";
import RandomDraw from "./RandomDraw";
import MemeGenerator from "./MemeGenerator";

import "./docs.css";

export default function DocViewer({closeCurrentDoc, currentDoc, docEdited, deleteDoc, signedIn}){
    const [changed, setChanged] = useState(false);
    const [editing, setEditing] = useState(false);

    const changedDoc = useRef({});
    console.log(signedIn);

    function handleDocChange(newDoc){
        if(!signedIn) {
            return;
        }
        
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
            case 'meme': 
                return <MemeGenerator {...customProps}/>;
            default:
                return null;
        }
    }

    return (
        <>
            <div className="doc-display--button-container">
                <button onClick={handleClose}>{changed ? 'Save and ' : ''}Close Doc</button>
                <button onClick={() => setEditing(!editing)} className={editing ? "close-btn" : ""}>
                    {editing ? "Close Editor" : "Edit Doc"}
                </button>
                <button onClick={deleteDoc}>Delete Doc</button>
            </div>
            { docDisplay() }
        </>
    );
}