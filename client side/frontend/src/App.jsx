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
import ProfilePage from "./pages/dashboard/ProfilePage";
import EditAnnonce from "./pages/dashboard/editAnnonce";
import ChangePassword from "./components/layouts/inputs/changePassowd";
import UserOrdersPage from "./pages/dashboard/oredersPage";
import SoldItems from "./pages/dashboard/SoldItems";
import CategoryListings from "./pages/CategoryListings";
import SearchResults from "./pages/dashboard/SearchResults";
import FavoritesPage from "./components/Favorites/FavoritesPage";
import WantedAnnouncements from "./pages/dashboard/WantedAnnouncements";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" exact element={<Home />} />
          <Route path="/signup" exact element={<SignUp />} />
          <Route path="/postad" exact element={<PostAd />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/annonces/:id" exact element={<AnnonceDetail />} />
          <Route path="/userannonces" exact element={<UserAnnonces />} />
         
          <Route path="/profile" exact element={<ProfilePage />} />
          <Route path="/edit-annonce/:id" exact element={<EditAnnonce />} />
          <Route path="/change-pass" exact element={<ChangePassword/>} />
          <Route path="/user-orders" exact element={<UserOrdersPage />} />
          <Route path="/sold-items" exact element={<SoldItems />} />
          <Route path="/search" exact element={<SearchResults />} />
          <Route path="/favourites" exact element={<FavoritesPage />} />
          <Route path="/wanted" exact element={<WantedAnnouncements />} />
          
          {/* Category Routes */}
          <Route path="/category/:category" element={<CategoryListings />} />
          <Route path="/category/:category/:subcategory" element={<CategoryListings />} />
        </Routes>
      </Router>
    </div>
  );
};
export default App;
