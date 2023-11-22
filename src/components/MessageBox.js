import React, { useEffect, useState } from "react";
import { getDatabase, ref as firebaseRef, onValue } from "firebase/database";
import Message from "./Message";
import moment from "moment";

export default function MessageBox(props) {
  const [messages, setMessages] = useState([]);
  const boxId = props["boxId"];

  useEffect(() => {
    const db = getDatabase();

    const starCountRef = firebaseRef(db, `messages/${boxId}`);
      onValue(starCountRef, (snapshot) => {
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
            return <Message user={elem["usr"]} message={elem["msg"]} datetime={elem["dte"]} key={keys[i]} />
          });

          setMessages(manip);
        }
      });
  }, [boxId]);

  return (
    <div className="chat">
      {messages.length === 0 ? "This box has no messages!" : messages}
    </div>
  )
}