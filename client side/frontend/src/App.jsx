import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/dashboard/Home";
import SignUp from "./pages/Auth/SignUp";
import PostAd from "./pages/dashboard/postAnnonce";
import Login from "./pages/Auth/login";
import AnnonceDetail from "./pages/dashboard/annonceDetails";
import UserAnnonces from "./pages/dashboard/userAnnonces";
import UpdateProfileForm from "./pages/dashboard/updateProfileForm";
import ProfilePage from "./pages/dashboard/ProfilePage";
const App = () => {
  return (
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/home" exact element={<Home />} />
            <Route path="/signup" exact element={<SignUp />} />
            <Route path="/postad" exact element={<PostAd />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/annonces/:id" exact element={<AnnonceDetail />} />
            <Route path="/userannonces" exact element={<UserAnnonces />} />
            <Route path="/updateProfile" exact element={<UpdateProfileForm />} />
            <Route path="/profile" exact element={<ProfilePage />} />
          </Routes>
        </Router>
      </div>
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
