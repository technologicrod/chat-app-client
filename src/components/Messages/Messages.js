import React, { useEffect, useState } from "react";
import "./messages.css";
import { format } from "timeago.js";
import Axios from 'axios';

export default function Messages({ message, uidinfo }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userProfilePic, setUserProfilePic] = useState("");
  const [receiverProfilePic, setReceiverProfilePic] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfilePic = async () => {
      try {
        const response = await Axios.get(`http://localhost:8000/update/${uidinfo}`);
        setUserProfilePic(response.data.profilepic);
      } catch (error) {
        console.log('Error fetching user profile picture:', error);
      }
    };

    fetchUserProfilePic();
  }, [uidinfo]);

  useEffect(() => {
    const fetchReceiverProfilePic = async () => {
      try {
        if (uidinfo !== message.senderId) {
          const response = await Axios.get(`http://localhost:8000/update/${message.senderId}`);
          setReceiverProfilePic(response.data.profilepic);
        }
      } catch (error) {
        console.log('Error fetching receiver profile picture:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchReceiverProfilePic();
  }, [message.senderId, uidinfo]);

  const timestamp = message.timestamp
    ? {
        _seconds: message.timestamp._seconds,
        _nanoseconds: message.timestamp._nanoseconds,
      }
    : null;
  const formattedTimestamp = timestamp
    ? format(new Date(timestamp._seconds * 1000), "en_US")
    : "";

  const isSender = message.senderId === uidinfo;

  return (
    <>
      {isLoading ? (
        <div className="messagewrapper">
          <p>Loading...</p>
        </div>
      ) : (
        <div className={isSender ? "messagewrapper own" : "messagewrapper"}>
          <div className="messagetop">
            {isSender ? (
              <img
                className="messageimg"
                src={`data:image/jpeg;base64,${userProfilePic}`}
                alt="User Avatar"
              />
            ) : (
              <img
                className="messageimg"
                src={`data:image/jpeg;base64,${receiverProfilePic}`}
                alt="Receiver Avatar"
              />
            )}
            <p className="messagetext">{message.content}</p>
          </div>
          <div className="messagebottom">{formattedTimestamp}</div>
        </div>
      )}
    </>
  );
}
