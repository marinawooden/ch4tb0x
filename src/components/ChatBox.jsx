import React, { useEffect, useState } from "react";
import MessageBox from "./MessageBox";
import { getDatabase, ref as firebaseRef, set as firebaseSet, get as firebaseGet, child } from "firebase/database";

import "../styles/ChatBox.css";
import Smileys from "./Smileys";

import emojiRegex from "emoji-regex";

import DEFAULT_CHATBOX_CONFIG from "../data/defaultChatConfig";

// use the url params (hash) to identify the specific chatbox, 
export default function ChatBox(props) {
  const [screenname, setScreenName] = useState(''); // currently typed screen name
  const [message, setMessage] = useState(''); // currently typed message 
  const [datetime, setDatetime] = useState(''); // current date and time
  const [loc, setLoc] = useState(); // users location (country)
  const [smileys, setSmileys] = useState(null); // which smileys family is selected
  const [smileysShown, setSmileysShown] = useState(true); // whether or not the choose dialog is shown
  
  const preferences = React.useRef(null);
  const chatHash = props["identifier"];
  const messageInputRef = React.useRef(null);

  useEffect(() => {
    const db = getDatabase();

    if (screenname.length > 0 && message.length > 0) {
      const messageToSend = {
        "usr": screenname,
        "msg": message,
        "dte": datetime,
        "loc": loc || "unknown"
      }

      firebaseSet(firebaseRef(db, `messages/${chatHash}/${randomHash()}`), messageToSend); // posts messages raw into db under "msg"
    }
  }, [message, screenname, datetime, chatHash]);

  // page load behavior- request location, etc
  useEffect(() => {
    (async () => {
      try {
        // preferences for chatbox request
        const db = getDatabase();
        const snapshot = await firebaseGet(firebaseRef(db, `preferences/${chatHash}`))
        let retrievedPrefs;

        if (snapshot.exists()) {
          retrievedPrefs = snapshot.val();
        } else {
          firebaseSet(firebaseRef(db, `preferences/${chatHash}`), DEFAULT_CHATBOX_CONFIG);
          retrievedPrefs = DEFAULT_CHATBOX_CONFIG
        }

        preferences.current = retrievedPrefs;

        // get face packs
        const faces = await import(`../faces/${preferences.current?.smileys || "default"}.js`);
        setSmileys(faces.default);

        try {
          // location requests
          let ipReq = await fetch("https://api.ipify.org/?format=json");
          await statusCheck(ipReq);
          ipReq = await ipReq.json();

          let geoLoc = await fetch(`https://ipapi.co/${ipReq.ip}/json/`);
          await statusCheck(geoLoc);
          geoLoc = await geoLoc.json()
          

          setLoc(geoLoc.country);
        } catch (err) {
          console.error(err);
          setLoc(undefined);
        }
        
      } catch (err) {
        // TODO: better error handling
        console.error(err);
      }
    })();
  }, []);

  const formSub = async (e) => {
    e.preventDefault();
    try {
      let usr = e.target.querySelector(".screenname");
      let msgElem = e.target.querySelector(".msg-input");
      let dte = new Date().toLocaleString();
      let msg = processMsg(msgElem.childNodes, smileys);

      setScreenName(usr.value);
      setMessage(msg);
      setDatetime(dte);

      usr.value = "";
      msgElem.innerHTML = "";
    } catch (err) {
      console.error(err);
      alert("An error occurred!", err.message);
    }
  }

  if (preferences.current) {
    return (
      <div className="chatbox">
        <main>
          <MessageBox
            boxId={chatHash}
            smileys={smileys}
            preferredFaces={preferences.current.smileys}
          />
          <form onSubmit={formSub}>
            <div className="text-options">
              <input
                required
                name="screenname"
                placeholder="Screen name"
                className="screenname"
                autoComplete="off"
                maxLength={30}
              ></input>
              <div
                className="option"
                onClick={() => setSmileysShown(!smileysShown)}
              >
              {
                preferences.current?.smileys === "default" && smileys ?
                Object.values(smileys)?.[0] :
                smileys ?
                <img src={Object.values(smileys)?.[0]} alt="preview smiley" /> :
                "??"
              }
              </div>
              {smileys ? <div id="smiley-select" className={!smileysShown ? "hidden" : ""}>
                <Smileys
                  smileys={smileys}
                  preferredFaces={preferences.current?.smileys}
                  messageBox={messageInputRef}
                />
              </div> : <></>}
            </div>
            <div
              required
              contentEditable="true"
              ref={messageInputRef}
              name="message"
              placeholder="Message"
              className="msg-input"
              autoComplete="off">
              
            </div>
            <button>Send</button>
          </form>
        </main>
        <footer>
          <a href="*">Chatbox.com</a>
        </footer>
      </div>
    )
  } else {
    return (
      <p>Loading...</p>
    )
  }
}

function processMsg(msgContents, smileys, charset="default") {
  let str = "";
  let seenFaces = {}; // memoize the faces for a little faster lookup

  console.log(msgContents);

  [...msgContents].forEach((elem) => {
    let content = elem.alt || elem.textContent;
    
    if (charset === "default") {
      const VALID_EMOJIS = Object.values(smileys).join("");
      const EMOJI_REGEX = new RegExp(`[${VALID_EMOJIS}]+`, "g");

      console.log(VALID_EMOJIS);
      console.log(content);
      
      let emotesText = content.match(EMOJI_REGEX)?.map((e) => [...e]);
      let nonEmotesText = content.split(EMOJI_REGEX);
      
      console.log(emotesText);
      console.log(nonEmotesText);

      let parsedTextNodes = [];

      nonEmotesText?.forEach((txt, i) => {
        let faces = emotesText?.[i]?.map((face) => {
          let newFace = face;
          
          if (seenFaces[face]) {
            newFace = seenFaces[face];
          } else {
            let charSymbol = [...Object.keys(smileys)].find(k => smileys[k] == face);
            console.log(charSymbol);
            seenFaces[face] = charSymbol || null;
  
            newFace = charSymbol;
          }

          return newFace
        });

        parsedTextNodes.push(txt);
        faces && parsedTextNodes.push(faces.join(""));
      });

      content = parsedTextNodes.join("");
    }

    str += content;
  });

  return str;
}

async function statusCheck(res) {
  if (!res.ok) {
    throw new Error(await res.text())
  }

  return res
}

function randomHash() {
  return Math.random().toString(36).slice(2);
}