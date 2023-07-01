import React, {useState, useEffect} from 'react';
import './App.css';
import Axios from 'axios';
import { Link, useNavigate, generatePath, useParams } from 'react-router-dom';

function Update() {
  const { rdata } = useParams();
  const loginid = rdata;
  console.log("login", loginid)
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [email, setemail] = useState("")
    const [profpic, setprofpic] = useState("")
    const navigate = useNavigate();
    const [userinfo, setuserinfo] = useState("");
    const [uidinfo, setuidinfo] = useState("");
    const [allinfo, setallinfo] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const handleBack = async (e) => {
      let rdata = loginid
      rdata && navigate(generatePath("/home/:rdata", { rdata }));
    }

    useEffect(() => {
        async function fetchData() {
        await Axios.get(`https://chat-app-server-production-63a9.up.railway.app/confirm?loginid=${loginid}`).then((response) => {
            setuserinfo(response.data);
            console.log("confirm", response.data)
        })
        }
        fetchData();
    }, [loginid]);
    useEffect(() => {
        async function fetchData() {
          const response = await Axios.get(`https://chat-app-server-production-63a9.up.railway.app/fetchid?loginid=${loginid}`);
          setuidinfo(response.data);
          setIsLoading(false);
          console.log("fetchid", response.data)
        }
        fetchData();
      }, [loginid]);
      useEffect(() => {
        async function fetchData() {
          if (loginid !== "") {
            const response = await Axios.get(`https://chat-app-server-production-63a9.up.railway.app/update/${loginid}`);
            setallinfo(response.data);
            console.log(response.data)
          }
        }
        fetchData();
      }, [loginid]);
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
            const formData = new FormData()
            formData.append('username', username)
            formData.append('password', password)
            formData.append('email', email)
            formData.append('profilepic', profpic)
            formData.append('userId', loginid)
            await Axios.put("https://chat-app-server-production-63a9.up.railway.app/updateuser", formData);
            alert("Account updated");
            let rdata = loginid
            rdata && navigate(generatePath("/home/:rdata", { rdata }));
            window.location.reload();
          } catch (error) {
            if (error.response && error.response.status === 409) {
              alert("Username or email already exists");
            } else {
              alert("Failed to register account");
              console.log(username, password, email, loginid)
            }
          }
        }
      }
      
  return (
      <div className="App">
        <button type="button" class="btn btn-primary backbutton" onClick={handleBack}>Back</button>
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
            <div class="form-group">
                <label for="formFile" class="form-label mt-4">ID Picture</label>
                <input name="inputd" class="form-control" type="file" id="formFile" onChange={(e) =>{setprofpic(e.target.files[0])}} required />
              </div>
            <button type="button" class="btn btn-primary loginbutton" onClick={register}><b>Submit</b></button>
            </form>
        </main>
      </div>
    );
}

export default Update;
