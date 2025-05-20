import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";

const AnnonceImages = ({ setValue, watch }) => {
  //External states
  const images = watch("images");

  //local states
  const [displayImages, setDisplayImages] = useState([]);

  //Effects
  useEffect(() => {
    setDisplayImages(images.map((image) => URL.createObjectURL(image)));
  }, [images]);
  return (
    <div className="grid grid-cols-4 gap-4 text-gray-400">
      {/*import image list */}
      {displayImages.map((image, index) => (
        <img
          key={index}
          src={image}
          className="w-full h-40 object-cover rounded-lg curser-pointer hover:opacity-50"
        />
      ))}
      {/*Hiden file input*/}
      <input
        type="file"
        accept="image/*"
        id="post-image"
        className="hidden"
        multiple
        onChange={(e) => {
          const newImages = images.concat(Array.from(e.target.files));
          if (newImages.length > 8) setValue("images", newImages.slice(0, 8));
          else setValue("images", newImages);
          e.target.value = "";
        }}
      />

      {/*Displayed file input*/}
      {images.length < 8 && (
        <label
          htmlFor="post-image"
          className="w-full h-40 border border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100"
        >
          <FaCamera className="text-3xl" />
          Add an image
        </label>
      )}
    </div>
  );
};

export default AnnonceImages;
