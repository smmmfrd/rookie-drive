import { useState, useEffect } from "react";
import DocDisplay from "./DocDisplay";

const MAX_TODOS = 15;

export default function Todo({doc, editing, docChange}){
    const [todos, setTodos]  = useState([]);

    useEffect(() => {
        setTodos(Object.keys(doc)
            .sort()
            .reduce((arr, key) => {
                if(key !== 'type'){
                    return [...arr, doc[key]]
                } else {
                    return arr;
                }
            },[])
        );
    }, [doc]);

    const todoElements = todos.map((t, index) => (
        <div key={index} className="todo-container">
            <input type='checkbox'
                checked={t.done}
                onChange={(e) => handleChange(e, index)}
            />
            {t.todo}
        </div>
    ));

    function handleChange(event, index){
        const change = event.target.type === 'checkbox' ? {done: event.target.checked} : {todo: event.target.value};

        var newTodos = todos.map((t, i) => {
            if(i === index){
                return {...t, ...change};
            } else {
                return t;
            }
        });
        setTodos(newTodos);

        var newDoc = {type: 'todo'};
        newTodos.forEach((todo, index) => {
                newDoc[`t${index}`] = todo;
        });
        docChange(newDoc);
    }

    const editElements = () => {
        var elements = todos.map((t, index) => {
            return (
                <div key={`i${index}`}>
                    <input maxLength="30" value={t.todo} onChange={(e) => handleChange(e, index)}/>
                    <button onClick={() => handleRemove(index)}>&times;</button>
                </div>
            )
        });

        elements.push(todos.length < MAX_TODOS ? 
            <p key={'add-btn'}><button onClick={handleAdd}>Add Todo</button></p> :
            <p><button disabled="true">Max Choices Reached</button></p>
        );

        return elements;
    }

    function handleAdd(){
        setTodos(prev => {
            return [...prev, {done: false, todo: ""}]
        })
    }

    function handleRemove(index){
        setTodos(prev => {
            return prev.filter((t, i) => {
                return i !== index;
            })
        })
    }

    return (
        <DocDisplay 
            docElement={todoElements}
            editing={editing}
            editElements={editElements()}
        />
    )
}