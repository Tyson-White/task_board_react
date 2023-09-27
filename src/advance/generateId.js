export const generateId = () => {
  const chars = "ZYXWVUTSRQPONMLKJIHGFEDCBA1234567890";
  var stroke = "";
  for (i = 0; i < 6; i++) {
    stroke += chars[Math.floor(Math.random() * chars.length)];
  }

  return stroke;
};

export default generateId;
