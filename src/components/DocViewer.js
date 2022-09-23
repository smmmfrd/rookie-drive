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
            case 'quiz': 
                return <Quiz {...customProps}/>;
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

function Quiz({doc, editing, docChange}){
    const [questions, setQuestions] = useState([]);
    
    useEffect(() => {
        setQuestions(Object.keys(doc)
            .sort()
            .reduce((arr, key) => {
                if(key !== 'type'){
                    const oldQuestion = doc[key];
                    var newQuest = Object.keys(oldQuestion).sort().reduce((obj, key) => {
                        if(key !== 'correct') {
                            obj[key] = oldQuestion[key];
                        }
                        return obj;
                    }, {});
                    
                    return [...arr, newQuest]
                } else {
                    return arr;
                }
            },[])
        );
    }, []);

    const questonElements = questions.map((q, index) => (
        <Question key={index} questionData={q} handleSelection={handleSelection}/>
    ));

    function handleSelection(){

    }
    
    return (
        <div className="doc-editor">
            <div className="doc-editor--display">{questonElements}</div>
        </div>
    )
}

function Question({questionData, handleSelection}){
    const question = questionData.question;
    const answers = Object.keys(questionData).reduce((arr, key) => {
        if(key !== 'question'){
            return [...arr, questionData[key]];
        } else {
            return arr;
        }
    }, [])

    const answerElements = answers.map((answer, index) => {
        return <span className="quiz-answer--input" key={`a${index}`}>{answer}</span>
    });

    return(
        <div>
            <h2>{question}</h2>
            <div className="quiz-answer--container">{answerElements}</div>
        </div>
    )
}