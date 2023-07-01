import "./conversations.css"
import { useState, useEffect } from 'react';
import axios from "axios";

export default function Conversations({conversation, currentuser}){
    console.log("convos are", conversation)
    const[user,setuser] = useState(null)
    const[profpic, setprofpic] = useState()
    useEffect(() => {
        const friendid = conversation.members.find((m) => m !== currentuser)
        const getuser = async () => {
            try{
                const res = await axios.get(`https://chat-app-server-production-63a9.up.railway.app/update/${friendid}`)
                setuser(res.data.username)
                setprofpic(res.data.profilepic)
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
              <img className='conversationimg' alt="Friend Pic" src={`data:image/jpeg;base64,${profpic}`}/>
              <span className="conversationname">{user}</span>
            </div>
        </div>
    )
}