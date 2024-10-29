import { useEffect, useRef, useState } from "react";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detections, setDetections] = useState([]);
  const numberOfFaces = detections.length;

  const startVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    videoRef.current.srcObject = stream;
  };

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      startVideo();
    };

    loadModels();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handlePlay = () => {
    const canvas = faceapi.createCanvasFromMedia(videoRef.current);
    document.body.append(canvas);

    const displaySize = { width: 1280, height: 960 };
    faceapi.matchDimensions(canvas, displaySize);

    const intervalId = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = displaySize.width;
      canvasRef.current.height = displaySize.height;

      setDetections(detections);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      context.clearRect(0, 0, canvasRef.width, canvasRef.height);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
    }, 100);

    return () => clearInterval(intervalId);
  };

  return (
    <div className="m-0 p-0 w-screen h-screen flex justify-center items-center">
      <video
        ref={videoRef}
        width={1280}
        height={960}
        autoPlay
        muted
        onPlay={handlePlay}
      />
      <canvas ref={canvasRef} className="absolute"></canvas>
    </div>
  );
}

export default App;
