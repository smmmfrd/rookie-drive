import { useState, useEffect } from "react"

export default function RandomDraw({doc, editing, docChange}){
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
        if(choices.length === 0) { return;}

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