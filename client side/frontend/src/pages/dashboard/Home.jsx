import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">LoopShop</h1>
        <div>
          <Link to="/login" className="mr-4 text-gray-700">Se connecter</Link>
          <Link to="/signup" className="text-blue-600 font-semibold">S'inscrire</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-16 bg-blue-500 text-white">
        <h2 className="text-3xl font-bold">Achetez et vendez des produits d'occasion facilement !</h2>
        <p className="mt-2">Rejoignez notre communauté et donnez une seconde vie à vos objets.</p>
        <Link to="/postad" className="mt-4 inline-block bg-white text-blue-600 px-6 py-2 rounded-full font-semibold">
          Déposer une annonce
        </Link>
      </header>

      {/* Barre de recherche */}
      <div className="mt-6 max-w-xl mx-auto flex items-center bg-white p-2 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          className="w-full p-2 outline-none"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Rechercher</button>
      </div>

      {/* Catégories */}
      <div className="mt-8 max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
        <button className="bg-white p-4 rounded-lg shadow-md">Électronique</button>
        <button className="bg-white p-4 rounded-lg shadow-md">Divertissement</button>
        <button className="bg-white p-4 rounded-lg shadow-md">Animaux</button>
        <button className="bg-white p-4 rounded-lg shadow-md">Femmes</button>
        <button className="bg-white p-4 rounded-lg shadow-md">Homme</button>
        <button className="bg-white p-4 rounded-lg shadow-md">Maison</button>
      </div>

      {/* Annonces récentes */}
      <section className="mt-10 max-w-6xl mx-auto">
        <h3 className="text-2xl font-semibold mb-4">Annonces récentes</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Exemple d'une annonce */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img
              src="https://via.placeholder.com/150"
              alt="Produit"
              className="w-full h-40 object-cover rounded-md"
            />
            <h4 className="font-semibold mt-2">Nom du produit</h4>
            <p className="text-gray-600">Prix: 50€</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 bg-gray-800 text-white text-center p-4">
        <p>&copy; 2025 Ecom C2C - Tous droits réservés</p>
      </footer>
    </div>
  );
};

export default Home;
