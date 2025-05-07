export const parseImages =(filename) => {
  const file = filename.split("\\").reverse()[0];
  return `http://localhost:4000/annonce-images/${file}`;
};