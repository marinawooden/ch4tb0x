import React, { useEffect, useState } from "react";
import { getDatabase, ref as firebaseRef, onValue } from "firebase/database";
import Message from "./Message";
import moment from "moment";

export default function MessageBox(props) {
  const [messages, setMessages] = useState([]);
  const boxId = props["boxId"];
  const smileys = props["smileys"];
  const preferredFaces = props["preferredFaces"]

  useEffect(() => {
    const db = getDatabase();

    const messagesRef = firebaseRef(db, `messages/${boxId}`);
      onValue(messagesRef, (snapshot) => {
        let data = snapshot.val();

        if (data) {
          let msgs = Object.values(data);
          let keys = Object.keys(data);

          // sort in reverse because flex rule is column-reverse
          msgs.sort((a, b) => {
            let dateOne = moment(a["dte"], "DD/MM/YYYY hh:mm:ss");
            let dateTwo = moment(b["dte"], "DD/MM/YYYY hh:mm:ss")

            if (dateTwo.valueOf() < dateOne.valueOf()) {
              return -1
            }
            
            if (dateTwo.valueOf() > dateOne.valueOf()) {
              return 1;
            }

            return 0;
          })

          let manip = msgs.map((elem, i) => {
            let processedWithFaces = smileys !== null ? facify(elem["msg"], smileys, (!preferredFaces || preferredFaces === "default")) : elem["msg"];

            return <Message
              user={elem["usr"]}
              message={processedWithFaces}
              datetime={elem["dte"]}
              loc={elem["loc"]}
              key={keys[i]}
            />
          });

          setMessages(manip);
        }
      });
  }, [smileys]);

  return (
    <div className="chat">
      {messages.length === 0 ? "This box has no messages!" : messages}
    </div>
  )
}

/**
 * 'Facifies' a message- meaning it turns all :text: into
 * smiley faces of the preferred faceSet (or emojis if there's no
 * preferred faceSet)
 * @param {String} message - the message to be 'facified'
 */
function facify(message, smileys, isDefault = true) {
  let textTokens = message.split(/:\w+:/g);
  let faceTokens = message.match(/:\w+:/g);

  let tokens = [];

  textTokens.forEach((tkn, i) => {
    tokens.push(tkn);
    tokens.push(faceTokens?.[i]);
  });

  // filter undefineds
  tokens = tokens.filter(tkn => !!tkn)

  // make them look nice
  tokens = [...tokens].map((tkn) => {
    let isFaceToken = /:\w+:/.test(tkn)

    if (isFaceToken) {
      if (!isDefault) {
        // todo: add alt
        return <img className="smiley" src={smileys[tkn]} />;
      } else {
        return <p>{smileys[tkn] || `${tkn}`}</p>;
      }
    } else {
      return <p>{tkn}</p>;
    }
  });

  return tokens;
}