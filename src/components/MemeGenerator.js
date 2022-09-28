import { useState } from "react";
import DocDisplay from "./DocDisplay";

export async function buildNewMeme(){
    var newMeme = {
        type: 'meme',
        topText: 'Top Text',
        bottomText: 'Bottom Text'
    };
    newMeme.img = await getMemeImg();
    return newMeme;
}

async function getMemeImg(){
    const res = await fetch("https://api.imgflip.com/get_memes");
    const json = await res.json();
    const memes = json.data.memes;
    var randomIndex = Math.floor(Math.random() * memes.length);

    return ({
        src: memes[randomIndex].url,
        alt: memes[randomIndex].name
    });
}

export default function MemeGenerator({doc, editing, docChange}){

    const [topText, setTopText] = useState(doc.topText);
    const [bottomText, setBottomText] = useState(doc.bottomText);
    const [img, setImg] = useState(doc.img);

    async function getNewImage(){
        const newImg = await getMemeImg();

        docEdited(newImg, 'img');
    }

    function docEdited(value, change){
        var newDoc = {
            type: 'meme',
            topText: topText,
            bottomText: bottomText,
            img: img
        }

        if(change === 'top'){
            newDoc.topText = value;
            setTopText(value);
        } else if (change === 'bottom'){
            newDoc.bottomText = value;
            setBottomText(value);
        } else if (change === 'img'){
            newDoc.img = value;
            setImg(value);
        }

        docChange(newDoc);
    }

    return(
        <DocDisplay
            docElement={<MemeDisplay img={img} topText={topText} bottomText={bottomText} />}
            editing={editing}
            editElements={<MemeEditor topText={topText} bottomText={bottomText} docEdited={docEdited} getNewImage={getNewImage}/>}
        />
    )
}

function MemeDisplay({img, topText, bottomText}){
    return(
        <div className="meme">
            <img className="meme--img" src={img.src} alt={`${img.alt} meme`}/>
            <h3 className="meme--text top">{topText}</h3>
            <h3 className="meme--text bottom">{bottomText}</h3>
        </div>
    )
}

function MemeEditor({docEdited, topText, bottomText, getNewImage}){
    return(
        <div className="doc-editor--input-container">
            <label>
                Top Text:
                <input onChange={(e) => docEdited(e.target.value, 'top')}
                value={topText} />
            </label>
            <label>
                Bottom Text:
                <input onChange={(e) => docEdited(e.target.value, 'bottom')}
                value={bottomText} />
            </label>
            <button onClick={getNewImage}>Get New Image</button>
        </div>
    )
}