import { useState, useEffect, useRef } from "react";

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
            default:
                return null;
        }
    }

    return (
        <>
            <div>
                <button onClick={handleClose}>{changed ? 'Save and ' : ''}Close Doc</button>
                <button onClick={() => setEditing(!editing)}>Edit Doc</button>
                <button onClick={deleteDoc}>Delete Doc</button>
            </div>
            { docDisplay() }
        </>
    );
}

function Note({doc, editing, docChange}){
    const [paragraphs, setParagraphs] = useState([]);

    useEffect(() => {
        buildParagraphs();
    }, [])

    function buildParagraphs(d = doc){
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
        const text = paragraphs.reduce((cur, p, currentIndex) => {
            return cur + p + (currentIndex !== paragraphs.length - 1 ? '\n' : '');
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

function Todo({doc, editing, docChange}){
    const [todos, setTodos]  = useState([])

    function buildTodos(d = doc){
        setTodos(Object.keys(d)
            .sort()
            .reduce((arr, key) => {
                if(key !== 'type'){
                    return [...arr, d[key]]
                } else {
                    return arr;
                }
            },[])
        );
    }

    useEffect(() => {
        buildTodos();
    }, [])

    const todoElements = todos.map((t, index) => (
        <div key={index} className="todo-container">
            <input type='checkbox'
                checked={t.done}
                onChange={(e) => handleCheckbox(e, t.todo)}
            />
            {t.todo}
        </div>
    ));

    function handleCheckbox(event, value){
        var newTodos = todos.map((t) => {
            if(t.todo === value){
                return {...t, done: event.target.checked}
            } else {
                return t
            }
        });
        setTodos(newTodos);
    }

    function handleTextChange(event, index){
        var newTodos = todos.map((t, i) => {
            if(i === index){
                return {...t, todo: event.target.value}
            } else {
                return t
            }
        });
        setTodos(newTodos);
    }

    const editElements = todos.map((t, index) => (
        <input key={`i${index}`} value={t.todo} onChange={(e) => handleTextChange(e, index)}/>
    ))

    return(
        <div className="doc-editor">
            {todoElements}
            {editing && 
                <div>
                    <h1>I'm here to edit!</h1>
                    {editElements}
                </div>
            }
        </div>
    )
}