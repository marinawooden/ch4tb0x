import React, { useEffect, useState } from "react";
import MessageBox from "./MessageBox";

import { useParams } from 'react-router-dom';
import { getDatabase, ref as firebaseRef, set as firebaseSet } from "firebase/database";

import "../styles/ChatBox.css";

// use the url params (hash) to identify the specific chatbox, 
export default function ChatBox(props) {

  const [screenname, setScreenName] = useState('');
  const [message, setMessage] = useState('');
  const [datetime, setDatetime] = useState('');

  const chatHash = props["identifier"];

  useEffect(() => {
    const db = getDatabase();

    if (screenname.length > 0 && message.length > 0) {
      firebaseSet(firebaseRef(db, `messages/${chatHash}/${randomHash()}`), {
      "usr": screenname,
      "msg": message,
      "dte": datetime
    }); // posts messages raw into db under "msg"
    }
  }, [message, screenname, datetime, chatHash]);

  const formSub = (e) => {
    e.preventDefault();

    let usr = e.target.querySelector(".screenname");
    let msg = e.target.querySelector(".msg-input");
    let dte = new Date().toLocaleString();


    setScreenName(usr.value);
    setMessage(msg.value);
    setDatetime(dte);

    usr.value = "";
    msg.value = "";
  }

  return (
    <div className="chatbox">
      <main>
        <MessageBox boxId={chatHash}/>
        <form onSubmit={formSub}>
          <input required name="screenname" placeholder="Screen name" className="screenname" autoComplete="off" maxLength={30}></input>
          <textarea required name="message" placeholder="Message" className="msg-input" autoComplete="off"></textarea>
          <button>Send</button>
        </form>
      </main>
      <footer>
        <a href="*">Chatbox.com</a>
      </footer>
    </div>
  )
}

function randomHash() {
  return Math.random().toString(36).slice(2);
}