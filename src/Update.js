import React, {useState, useEffect} from 'react';
import './App.css';
import Axios from 'axios';
import { Link, useNavigate, generatePath } from 'react-router-dom';

function Update() {
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [email, setemail] = useState("")
    const navigate = useNavigate();
    const [userinfo, setuserinfo] = useState("");
    const [uidinfo, setuidinfo] = useState("");
    const [allinfo, setallinfo] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function fetchData() {
        await Axios.get(`http://localhost:8000/confirm`).then((response) => {
            setuserinfo(response.data);
        })
        }
        fetchData();
    }, []);
    useEffect(() => {
        async function fetchData() {
          const response = await Axios.get(`http://localhost:8000/fetchid`);
          setuidinfo(response.data);
          setIsLoading(false);
        }
        fetchData();
      }, []);
      useEffect(() => {
        async function fetchData() {
          if (uidinfo !== "") {
            const response = await Axios.get(`http://localhost:8000/update/${uidinfo}`);
            setallinfo(response.data);
            console.log(response.data)
          }
        }
        fetchData();
      }, [uidinfo]);
    const validateEmail = (email) => {
        // Email regex pattern for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    useEffect(() =>{
        setusername(allinfo.username)
        setemail(allinfo.email)
        setpassword(allinfo.password)
      }, [allinfo.username, allinfo.email, allinfo.password])
    
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
    const register = async () => {
        var a = document.forms["myform"]["inputa"].value;
        var b = document.forms["myform"]["inputb"].value;
        var c = document.forms["myform"]["inputc"].value;
        
        if (a === "" || b === "" || c === "") {
          alert("Required fields must be filled out");
        } 
        else if (!validateEmail(email)) {
            alert("Invalid email address");
            } 
        else {
          try {
            await Axios.put("http://localhost:8000/updateuser", { username: username, password: password, email: email, userId: uidinfo });
            alert("Account updated");
            navigate('/home', { replace: true });
            window.location.reload();
          } catch (error) {
            if (error.response && error.response.status === 409) {
              alert("Username or email already exists");
            } else {
              alert("Failed to register account");
            }
          }
        }
      }
      
  return (
      <div className="App">
        <Link to="/home"><button type="button" class="btn btn-primary backbutton">Back</button></Link>
        <main class="container-fluid">
            <form class="createform" enctype="multipart/form-data" name="myform" required>
            <h3>Update {userinfo}'s account</h3>
            <div class="form-group">
            <label class="form-label mt-4">Email address</label>
            <input type="email" class="form-control inputclass2" name="inputa" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder={allinfo.email} defaultValue={allinfo.email} onChange={(e) =>{setemail(e.target.value)}} required/>
            </div>
            <div class="form-group">
            <label class="form-label mt-4">Username</label>
            <input type="email" class="form-control inputclass2" name="inputb" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder={allinfo.username} defaultValue={allinfo.username} onChange={(e) =>{setusername(e.target.value)}} required/>
            </div>
            <div class="form-group">
            <label for="exampleInputPassword1" class="form-label mt-4">Password</label>
            <input type="password" class="form-control inputclass2" name="inputc" id="exampleInputPassword1"  placeholder="password" defaultValue={allinfo.password}  onChange={(e) =>{setpassword(e.target.value)}} required/>
            </div>
            <button type="button" class="btn btn-primary loginbutton" onClick={register}><b>Submit</b></button>
            </form>
        </main>
      </div>
    );
}

export default Update;
