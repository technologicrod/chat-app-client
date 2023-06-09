import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Axios from 'axios';
import { Link, useNavigate, useParams, generatePath } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import Conversations from './components/Conversations/Conversations';
import Messages from './components/Messages/Messages';
import Onlines from './components/Onlines/Onlines';

function Home() {
  const { rdata } = useParams();
  const loginid = rdata;
  console.log("login", loginid)
  const [username, setusername] = useState("");
  const navigate = useNavigate();
  const scrollref = useRef()
  const handleLogout = async (e) => {
    try {
      const response = await Axios.post("https://chat-app-server-production-63a9.up.railway.app/logout", { rdata: loginid });
        if (response.status === 200) {
          alert("Logged out");
          navigate(generatePath("/", { replace: true }));
          //window.location.reload();
        }
    } catch (error) {
      console.log(error);
    }
  };
  const [checkinfo, setcheckinfo] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.get(`https://chat-app-server-production-63a9.up.railway.app/check?loginid=${loginid}`);
        //console.log("check", response.data)
        if (response.data.length > 0){
          setcheckinfo(true)
        }
      } catch (error) {
        console.log('Error:', error);
      }
    }
    fetchData();
  }, [loginid]);
  const [userinfo, setuserinfo] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.get(`https://chat-app-server-production-63a9.up.railway.app/confirm?loginid=${loginid}`);
        setuserinfo(response.data);
        console.log("respooo", response.data)
      } catch (error) {
        console.log('Error:', error);
      }
    }
    fetchData();
  }, [loginid]);

  const [uidinfo, setuidinfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [profpic, setprofpic] = useState()
  useEffect(() => {
  async function fetchData() {
    try {
      const response = await Axios.get(`https://chat-app-server-production-63a9.up.railway.app/fetchid?loginid=${loginid}`);
      const fetchedUidInfo = response.data;
      console.log("user id", fetchedUidInfo);
      if (fetchedUidInfo) {
        setuidinfo(fetchedUidInfo.id);
        setIsDataFetched(true); // Mark data as fetched
        setprofpic(fetchedUidInfo.profilepic)
        console.log("real", fetchedUidInfo.id);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('Error:', error);
    }
  }
  fetchData();
}, [loginid]);
  const [convos, setconvos] = useState([]);
  useEffect(() => {
    async function fetchData() {
      if (isDataFetched && uidinfo) {
        try {
          const response = await Axios.get(`https://chat-app-server-production-63a9.up.railway.app/convo/${uidinfo}`);
          if (response.data.length === 0) {
            console.log('No conversations found for the user');
            // Handle the case when no conversations are found
            // You can show a message to the user or take any other appropriate action
          } else {
            setconvos(response.data);
            console.log('response is', response);
          }
        } catch (error) {
          console.log('Error retrieving conversations:', error);
          // Handle the error condition
          // You can show a message to the user or take any other appropriate action
        }
      }
    }
    fetchData();
  }, [isDataFetched, uidinfo]);
  const [currentchat, setcurrentchat] = useState(null)
  console.log("current is", currentchat)
  const [messages, setmessages] = useState(null)
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await Axios.get(`https://chat-app-server-production-63a9.up.railway.app/messages/${currentchat.id}`);
        const sortedMessages = res.data.slice().sort((a, b) => {
          const timestampA = a.timestamp._seconds * 1000 + a.timestamp._nanoseconds / 1000000;
          const timestampB = b.timestamp._seconds * 1000 + b.timestamp._nanoseconds / 1000000;
          return timestampA - timestampB; // Sort in ascending order
        });
        setmessages(sortedMessages);
      } catch (err) {
        console.log(err);
      }
    };
  
    const interval = setInterval(getMessages, 1000); // Fetch messages every 1 second
  
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [currentchat]);
  console.log("messages are", messages)
  const [otherUser, setOtherUser] = useState('');
  const [newmessage, setnewmessage] = useState("")
  const handlesubmit = async (e) => {
    e.preventDefault();
    const secondMember = currentchat.members.find((member) => member !== uidinfo);
    setOtherUser(secondMember);
    console.log("second is", secondMember);
  
    const timestamp = {
      _seconds: firebase.firestore.Timestamp.now().seconds,
      _nanoseconds: firebase.firestore.Timestamp.now().nanoseconds
    };
  
    const message = {
      senderId: uidinfo,
      content: newmessage,
      conversationid: currentchat.id,
      receiverId: secondMember,
      timestamp: timestamp
    };
  
    try {
      const res = await Axios.post(`https://chat-app-server-production-63a9.up.railway.app/send`, message);
      console.log("Message sent successfully");
  
      // Get the ID from the response data
      const messageId = res.data.id;
  
      // Add the ID to the message object
      const newMessage = {
        ...message,
        id: messageId
      };
  
      // Update the messages state
      const updatedMessages = [...messages, newMessage];
      console.log("Before setmessages:", messages);
      setmessages(updatedMessages);
      console.log("After setmessages:", updatedMessages);
      setnewmessage("");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    scrollref.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);
  
  const update = (e) => {
    if (uidinfo) {
      let rdata = uidinfo
      rdata && navigate(generatePath("/update/:rdata", { rdata }));
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await Axios.get(`https://chat-app-server-production-63a9.up.railway.app/search`, {
        params: {
          username: searchTerm,
        },
      });
      setSearchResults(response.data);
      console.log(response.data[0])
    } catch (error) {
      console.error(error);
    }
  };
  const handleItemClick = async (itemId) => {
    console.log("Clicked item ID:", itemId);
    // Perform additional actions with the item ID
    // Reset the search bar
    setSearchTerm("");
    // Clear the search results
    setSearchResults([]);
    
    try {
      const newdata = {
        members: [uidinfo, itemId],
      };
      const res = await Axios.post(`https://chat-app-server-production-63a9.up.railway.app/conversations`, newdata);
      console.log("new is", res.data)
      // Add the new conversation data to the convos state
      setconvos(prevConvos => [...prevConvos, res.data]);
    } catch (err) {
      console.log(err);
      // Handle the error condition
      // You can show a message to the user or take any other appropriate action
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && !uidinfo) {
      navigate("/", { replace: true });
    }
  }, [isLoading, uidinfo, navigate]);

  if (isLoading){
    return <div>Loading...</div>;
  }
  else{
    if (checkinfo === false) {
      return (
        <div class="App">
          <div class="headform">
          <h1 class="titleheadform">You must log in first.</h1>
          </div>
          <Link to="/"><button type="button" class="btn btn-outline-primary">Log In</button></Link>
        </div>
        )
    }
    return (
      <div className="App">
        <Link to="/"><button type="button" class="btn btn-primary backbutton" onClick={handleLogout}>Log Out</button></Link>
        <main class="container-fluid">
          <h1>Hello {userinfo}</h1>
          <img className="profpic" alt="Profile Pic" src={`data:image/jpeg;base64,${profpic}`}/>
  
          <button type="button" class="btn btn-outline-info" onClick={update}>Edit Profile</button>
          <div class="message">
          <div className='chatmenu'>
            <div className='chatmenuwrapper'>
                <div className='searchwrapper'>
                    <input
                  type="text"
                  placeholder="Search friends"
                  className="chatinput"
                  value={searchTerm}
                  onChange={handleInputChange}
                />
                <button onClick={handleSearch} className='searchbutton'>Search</button>
                </div>
                <ul className="searchResultsList">
                  {searchResults.map((result) => (
                    <li
                      key={result.id}
                      className="searchResultItem"
                      onClick={() => handleItemClick(result.id)}
                    >
                      {result.username}
                    </li>
                  ))}
                </ul>
                {convos.map((c)=> (
                  <div onClick={()=>setcurrentchat(c)}>
                    <Conversations conversation={c} currentuser={uidinfo}/>
                  </div>
              ))}
            </div>
          </div>
          <div className='chatbox'>
            <div className='chatboxwrapper'>
              {
                currentchat ?
                <>
              <div className='chatboxtop'>
              {messages && messages.map((m) => (
                <div ref={scrollref} key={m.id}>
                  <Messages message={m} uidinfo={uidinfo} />
                </div>
              ))}
  
              </div>
              <div className='chatboxbottom'>
                <textarea className='chatmessageinput' placeholder='Write something' onChange={(e)=>setnewmessage(e.target.value)} value={newmessage}></textarea>
                <button className='chatsubmitbutton' onClick={handlesubmit}>Send</button>
              </div></>: <span className='noconversation'>Open a message to chat.</span>}
            </div>
          </div>
          <div className='chatonline'>
            <div className='chatonlinewrapper'>
              <Onlines/>
            </div>
          </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Home;
