import { BrowserRouter, Routes, Navigate, Route } from "react-router-dom";
import { createContext, useReducer } from "react";
import Home from "./components/tareas/Home";
import Tareas from "./components/tareas/Tareas";
import Login from "./components/tareas/login";
import axios from "axios";
export const AuthContext = createContext(null);

function App() {
  const LOGIN = "LOGIN";
  const login = (state, token) => {
    return { token: token };
  };

  const authReducer = (state, action) => {
    switch (action.type) {
      case "LOGIN":
        return login(state, action.token);
      default:
        return state;
    }
  };

  const [data, dispatch] = useReducer(authReducer, { token: null });

  const loginThunk = async (username, password) => {
    const res = await axios.post("http://127.0.0.1:8000/auth/", {
      username: username,
      password: password,
    });
    dispatch({ type: LOGIN, token: res.data.token });
  };

  // 2. Wrap NextUIProvider at the root of your app
  return (
    <AuthContext.Provider value={{ data, loginThunk }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" />}></Route>
          <Route path="/inicio/*" element={<Login />}></Route>
          <Route path="/home/*" element={<Home />}></Route>
          <Route path="/tareas" element={<Tareas />}></Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
