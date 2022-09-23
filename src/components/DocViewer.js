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

    const [topText, setTopText] = useState(doc.topText);
    const [bottomText, setBottomText] = useState(doc.bottomText);
    const [img, setImg] = useState(doc.img);

    async function GetNewImage(){
        const res = await fetch("https://api.imgflip.com/get_memes");
        const json = await res.json();
        const memes = json.data.memes;
        var randomIndex = Math.floor(Math.random() * memes.length);
        setImg({
            src: memes[randomIndex].url,
            alt: memes[randomIndex].name
        });
    }

    return(
        <div className="doc-editor">
            <div className="doc-editor--display">
                <div className="meme">
                    <img className="meme--img" src={img.src} alt={`${img.alt} meme`}/>
                    <h3 className="meme--text top">{topText}</h3>
                    <h3 className="meme--text bottom">{bottomText}</h3>
                </div>
            </div>
            {editing && 
                <div className="doc-editor--input-container">
                    <label>
                        Top Text:
                        <input onChange={(e) => setTopText(e.target.value)} value={topText} />
                    </label>
                    <label>
                        Bottom Text:
                        <input onChange={(e) => setBottomText(e.target.value)} value={bottomText} />
                    </label>
                    <button onClick={GetNewImage}>Get New Image</button>
                </div>
            }
        </div>
    )
}