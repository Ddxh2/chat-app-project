import { useEffect, useState } from "react";

const useRandomGradient = () => {
  const [gradientSrc, setGradientSrc] = useState("");

  useEffect(() => {
    const randomInt = Math.ceil(Math.random() * 100);
    setGradientSrc(`/gradients/Mesh%20${randomInt}.jpg`);
  }, []);

  return gradientSrc;
};

export default useRandomGradient;
