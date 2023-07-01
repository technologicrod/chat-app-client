import React from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Login from './Login';
import Create from './Create';
import Home from './Home'
import Update from './Update'
function App() {
  /*const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  useEffect(() => {
    Axios.get("http://localhost:8000/").then((response) => {
      const itemData = response.data.itemData;
      if (itemData.length > 0) {
        const firstItem = itemData[1];
        setusername(firstItem._fieldsProto.username.stringValue);
        setpassword(firstItem._fieldsProto.password.stringValue);
        console.log(username, password);
      }
    });
  }, []);*/
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/create" element={<Create />} />
        <Route path="/home/:rdata" element={<Home />} />
        <Route path="/update/:rdata" element={<Update />} />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
