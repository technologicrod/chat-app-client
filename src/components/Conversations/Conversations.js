import "./conversations.css"
import { useState, useEffect } from 'react';
import axios from "axios";

export default function Conversations({conversation, currentuser}){
    console.log("convos are", conversation)
    const[user,setuser] = useState(null)
    useEffect(() => {
        const friendid = conversation.members.find((m) => m !== currentuser)
        const getuser = async () => {
            try{
                const res = await axios.get(`https://chat-app-server-production-63a9.up.railway.app/update/${friendid}`)
                setuser(res.data.username)
                console.log("friend data is", res.data.username)
            }catch(err){
                console.log(err)
            }
        }
        getuser()
      }, [conversation, currentuser]);
    return(
        <div>
            <div className='conversation'>
              <img className='conversationimg' src="https://i.pinimg.com/originals/53/ad/58/53ad58e3b7220a9dc085ca3673f346dd.jpg"/>
              <span className="conversationname">{user}</span>
            </div>
        </div>
    )
}