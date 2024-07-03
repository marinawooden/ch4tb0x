import ChatBox from "./components/ChatBox";
import "./styles/ChatBox.css";

function App(props) {
  return (
    <ChatBox identifier={props["indentifier"] || "12345678"} />
  );
}

export default App;
