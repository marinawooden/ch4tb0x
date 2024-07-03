import React from "react";
import "../styles/ChatBox.css";
import countryLookup from "../utils/countrylookup";

export default function Message(props) {
  const usr = props["user"];
  const msg = props["message"];
  const dte = props["datetime"];
  const loc = props["loc"]; // optional - chatbox owners can choose not to record location

  return (
    <div className="message">
      <div>
        <div className="userinfo">
          <p className="user">{usr}</p>
          <p className="country">{countryLookup(loc)}</p>
        </div>
        <div className="messagecontent">{msg}</div>
      </div>
      <time>{dte}</time>
    </div>
  )
}