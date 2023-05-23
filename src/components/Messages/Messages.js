import "./messages.css";
import { format } from "timeago.js";

export default function Messages({ message, uidinfo }) {
  const timestamp = message.timestamp
    ? {
        _seconds: message.timestamp._seconds,
        _nanoseconds: message.timestamp._nanoseconds
      }
    : null;
  const formattedTimestamp = timestamp
    ? format(new Date(timestamp._seconds * 1000), "en_US")
    : "";

  const own = message.senderId === uidinfo[0];

  return (
    <div className={own ? "messagewrapper own" : "messagewrapper"}>
      <div className="messagetop">
        <img
          className="messageimg"
          src="https://i.pinimg.com/originals/53/ad/58/53ad58e3b7220a9dc085ca3673f346dd.jpg"
          alt="User Avatar"
        />
        <p className="messagetext">{message.content}</p>
      </div>
      <div className="messagebottom">{formattedTimestamp}</div>
    </div>
  );
}
