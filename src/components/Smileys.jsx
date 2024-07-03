import { useEffect, useState } from "react";

const Smileys = ({messageBox, smileys, preferredFaces}) => {
  const icons = [...Object.keys(smileys)].map((smile, i) => {
    return !preferredFaces || preferredFaces === 'default' ? 
    <TextSmiley
      content={smileys[smile]}
      messageBox={messageBox}
      key={smile}
      smile={smile}
    /> : 
    <ImageSmiley
      content={smileys[smile]}
      messageBox={messageBox}
      key={smile}
      smile={smile}
    />
  });

  return icons
};

const TextSmiley = ({content, messageBox}) => {
  return (
    <p
      onClick={() => {
        messageBox.current.textContent += content
      }}>
      {content}
    </p>
  )
}

const ImageSmiley = ({content, messageBox, smile}) => {
  let parsedAlt = "smile";
  
  return (
    <img
      onClick={() => {
        let smileyElem = document.createElement("img");
        smileyElem.src = content;
        smileyElem.alt = smile;
        smileyElem.classList.add("smiley")

        messageBox.current.appendChild(smileyElem);
      }}
      className="smiley"
      src={content}
      alt={parsedAlt}
    />
  )
}



export default Smileys;