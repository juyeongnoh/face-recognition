import { useEffect, useRef, useState } from "react";

function App() {
  const videoRef = useRef(null);

  const startVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    videoRef.current.srcObject = stream;
  };

  useEffect(() => {
    startVideo();
  }, []);

  return (
    <>
      <video ref={videoRef} width="720" autoPlay muted />
    </>
  );
}

export default App;
