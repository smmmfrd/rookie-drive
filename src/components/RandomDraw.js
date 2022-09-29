import { useState, useEffect, useCallback } from "react"
import DocDisplay from "./DocDisplay";

const MAX_CHOICES = 10;

export default function RandomDraw({doc, editing, docChange}){
    const [choices, setChoices] = useState([]);
    const [current, setCurrent] = useState('');

    const buildState = useCallback(
        (d = doc) => {
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
    , [doc]);

    useEffect(() => {
        buildState();
    }, [buildState]);

    const pickElement = (
        <div>
            {current.length > 0 && <h1>{current}</h1>}
            <button onClick={pickRandom}>Pick {current.length > 0 ? "Another" : "Random" }</button>
        </div>
    );

    const listElements = choices.map((c, index) => {
        return (
            <>
                <p key={index}>
                    {c}
                </p>
                {index === choices.length - 1 && pickElement}
            </>
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

    const editElements = choices.map((c, index) => {
        return(
            <>
            <div key={`r${index}`}><input maxLength="30" value={c} onChange={(e) => handleInput(e, index)}/><button onClick={() => handleRemove(index)}>&times;</button></div>
            {index === choices.length - 1 && (choices.length < MAX_CHOICES ? <p><button onClick={handleAdd}>Add Choice</button></p> : <p><button disabled="true">Max Choices Reached</button></p>)}
            </>
        )
    });

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
        <DocDisplay 
            docElement={listElements}
            editing={editing}
            editElements={editElements}
        />
    )
}