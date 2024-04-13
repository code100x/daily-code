import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Event handler function to update the state variables when the window is resized
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    // Event listener for resize event
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Return the current window width and height
  return { windowWidth, windowHeight };
};

export default useWindowSize;
