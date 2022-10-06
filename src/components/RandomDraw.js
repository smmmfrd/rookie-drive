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
            <button className="random-btn" onClick={pickRandom}>Pick {current.length > 0 ? "Another" : "Random" }</button>
        </div>
    );

    const listElements = choices.map((c, index) => {
        return (
            <>
                <p className="random-choice" key={index}>
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
            return (index !== currentIndex && cur.length > 0) ? [...arr, index] : arr;
        }, [])
        let newIndex = randIndexes[Math.floor(Math.random() * randIndexes.length)]
        setCurrent(choices[newIndex]);
    }

    const editElements = () => {
        var elements = choices.map((c, index) => {
            return(
                <div className="list-input" key={`r${index}`}>
                    <input maxLength="30" value={c} onChange={(e) => handleInput(e, index)}/>
                    <button className="delete-btn" onClick={(e) => handleInput(e, index, 'delete')}>&times;</button>
                </div>
            )
        });

        elements.push(choices.length < MAX_CHOICES ? 
            <p><button className="add-btn" onClick={handleAdd}>Add Choice</button></p> :
            <p><button className="add-btn" disabled="true">Max Choices Reached</button></p>
        );

        return elements;
    };

    function handleInput(event, index, change = 'edit'){
        var newChoices;

        if(change === 'edit') {
            newChoices = choices.map((t, i) => {
                if(i === index){
                    return event.target.value;
                } else {
                    return t;
                }
            });
        } else if (change === 'delete') {
            newChoices = choices.reduce((arr, current, i) => {
                return i === index ? arr : [...arr, current];
            }, []);
        }
        setChoices(newChoices);

        var newDoc = {type: 'rand'};
        newChoices.forEach((choice, index) => {
            if(choice.length > 0){
                newDoc[`r${index}`] = choice;
            }
        });
        docChange(newDoc);
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
            editElements={editElements()}
        />
    )
}