import React from "react";
import UserProvider from "./context/UserContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/dashboard/Home"
import LoopShop from "./pages/dashboard/LoopShop";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<SignUp />} />
            <Route path="/home" exact element={<Home />} />
            <Route path="/loopshop" exact element={<LoopShop />} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
};
export default App;

const Root = () => {
  //Check if  token is exists in local storage
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
    <Navigate to="/home" />
  ) : (
    <Navigate to="/login" />
  );
};
