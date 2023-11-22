import React from "react";
import "../styles/ChatBox.css";

export default function Message(props) {
  const usr = props["user"];
  const msg = props["message"];
  const dte = props["datetime"];

  return (
    <div className="message">
      <div>
        <p className="user">{usr}</p>
        <p>{msg}</p>
      </div>
      <time>{dte}</time>
    </div>
  )
}