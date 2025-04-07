import React from "react";
import { useState , useContext} from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import  API_PATHS  from "../../utils/apiPaths";
import  AnnonceContext  from "../../context/UserContext";
import MultipleImageSelector from "../../components/layouts/inputs/MultipleImageSelector";

const PostAd = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [condition,setCondition] = useState("");
  const [annonceType,setAnnonceType] = useState("");
  const [images, setImages] = useState([]);

  const [error, setError] = useState(null);

  const updateAnnonce  = useContext(AnnonceContext);

  const Navigate = useNavigate();

  const handlePostAdd = async (e) => {
    e.preventDefault();


    
    if (!title) {
      setError("Please enter your title");
      return;
    }

    if (!description) {
      setError("Please enter the description.");
      return;
    }

    if (!category) {
      setError("Please enter the category.");
      return;
    }

    if (!annonceType) {
      setError("Please enter annonce type.");
      return;
    }
      if (!condition) {
        setError("Please enter the condition.");
        return;
      }
        if (!price) {
          setError("Please enter the price.");
          return;
        }
    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.ANNONCE, {
        title,
        description,
        category,
        annonceType,
        condition,
        price,
        images
      });

      const { token, annonce } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateAnnonce(annonce);
        alert("Annonce publiée avec succès !");
        setTitle("");
        setDescription("");
        setCategory("");
        setPrice(0);
        setImages([]);
        Navigate("/home");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-grey-100 rounded-lg flex flex-col ">
      <h2  className="text-2xl font-semibold mb-4">Buy your article</h2>

      <form onSubmit={handlePostAdd} className="space-y-4 mt-4">
      <div className="mb-4">
      <label className="text-gray-600 mb-2">Add up to 5 photos.</label>
        <div className="border-dashed border-2 border-gray-400 p-4 rounded-lg flex flex-row relative cursor-pointer justify-center items-center transition hover:border-blue-500">
          <MultipleImageSelector images={images} setImages={setImages} maxImages={5} />
        </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            className="w-full p-2 border rounded-lg "
            placeholder="ex : Chemise verte Zara"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={({ target }) => setDescription(target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="ex : porté quelques fois, taille correctement"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block font-medium text-gray-700">Type</label>
          <select
            value={annonceType}
            onChange={({ target }) => setAnnonceType(target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="ex : porté quelques fois, taille correctement"
            required
          >
            <option value="">Select annonce type</option>
            <option value="sale">sale</option>
            <option value="trade">Trade</option>
            <option value="free">Free</option>
            <option value="rent">Rent</option>
            <option value="wanted">Wanted</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={({ target }) => setCategory(target.value)}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select category</option>
            <option value="electronic">Electronic</option>
            <option value="Clothing">Clothing</option>
            <option value="Toys & Games">Toys & Games</option>
            <option value="Sports & Outdoors">Sports & Outdoors</option>
            <option value="Arts & Crafts">Arts & Crafts</option>
            <option value="Phones & Accessories">Phones & Accessories</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium text-gray-700 ">Condition</label>
          <select
            value={condition}
            onChange={({ target }) => setCondition(target.value)}
            className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
            placeholder="ex : porté quelques fois, taille correctement"
            required
          >
            <option value="">Condition</option>
            <option value="new">New</option>
            <option value="like new">Like new</option>
            <option value="good condition">Good condition</option>
            <option value="Acceptable">Acceptable</option>
            <option value="not working">Not working</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium text-gray-700">Price(DZD)</label>
          <input
            value={price}
            onChange={(target) => setPrice(target.value)}
            placeholder="ex : 1000 "
            className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Publier l'annonce
        </button>
      </form>
    </div>
  );
};

export default PostAd;
