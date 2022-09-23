import { useState, useRef, useEffect } from "react";

import Note from "./Note";
import Todo from "./Todo";
import RandomDraw from "./RandomDraw";

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
            case 'meme': 
                return <MemeGenerator {...customProps}/>;
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

function MemeGenerator({doc, editing, docChange}){
    const {topText, bottomText, img} = doc;

    return(
        <div className="doc-editor">
            <div className="doc-editor--display">
                <div className="meme">
                    <img className="meme--img" src={img} alt="A randomly generated meme"/>
                    <h3 className="meme--text top">{topText}</h3>
                    <h3 className="meme--text bottom">{bottomText}</h3>
                </div>
            </div>
            {editing && 
                <div className="doc-editor--input-container">
                    <h2>Editing</h2>
                </div>
            }
        </div>
    )
}