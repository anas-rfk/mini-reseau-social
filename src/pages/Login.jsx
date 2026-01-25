import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../features/auth/slice";
import { useNavigate } from "react-router-dom";


const API_URL = "http://localhost:3001";

function Login() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();



  useEffect(() => {
  axios
    .get(`${API_URL}/users`)
    .then((res) => {
      console.log("USERS:", res.data);
      setUsers(res.data);
    })
    .catch((err) => {
      console.error("FETCH USERS ERROR:", err);
    });
}, []);


  return (
    <div>
      <h2>Login</h2>

      <select
        value={selectedUser}
        onChange={(e) => {
            const userId = e.target.value;
            setSelectedUser(userId);

            const user = users.find((u) => String(u.id) === userId);

            if (user) {
                dispatch(setCurrentUser(user));
                navigate("/");
            }
            }}


      >
        <option value="">-- Choisir un utilisateur --</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Login;
