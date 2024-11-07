import { useEffect, useRef, useState } from "react";

function App() {
  const URL = "https://teachablemachine.withgoogle.com/models/YGkYUyopw/";

  const webcamRef = useRef(null);
  const labelRef = useRef(null);
  const dialogRef = useRef(null);

  const [isStarted, setIsStarted] = useState(false);

  const [prediction, setPrediction] = useState({
    rabbit: 0,
    cat: 0,
    dog: 0,
    hamster: 0,
    bear: 0,
    fox: 0,
  });

  let model, webcam, labelContainer, maxPredictions;

  async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    webcamRef.current.appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
      labelRef.current.appendChild(document.createElement("div"));
    }
  }

  async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
  }

  // run the webcam image through the image model
  async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
      const classPrediction =
        prediction[i].className + ": " + prediction[i].probability.toFixed(2);

      // labelContainer.childNodes[i].innerHTML = classPrediction;
      // labelRef.current.childNodes[i].innerHTML = classPrediction;
      // console.log(classPrediction);

      switch (prediction[i].className) {
        case "dog":
          setPrediction((prev) => ({
            ...prev,
            dog: prediction[i].probability,
          }));
          break;
        case "cat":
          setPrediction((prev) => ({
            ...prev,
            cat: prediction[i].probability,
          }));
          break;
        case "rabbit":
          setPrediction((prev) => ({
            ...prev,
            rabbit: prediction[i].probability,
          }));
          break;
        case "hamster":
          setPrediction((prev) => ({
            ...prev,
            hamster: prediction[i].probability,
          }));
          break;
        case "bear":
          setPrediction((prev) => ({
            ...prev,
            bear: prediction[i].probability,
          }));
          break;
        case "fox":
          setPrediction((prev) => ({
            ...prev,
            fox: prediction[i].probability,
          }));
          break;
      }
    }
  }

  const startTimer = async () => {
    let count = 3;
    const interval = setInterval(() => {
      count--;
      setTimer(count);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);

      handleClickCapture();
    }, 3000);
  };

  // useEffect(() => {
  //   if (isStarted) return;
  //   init();
  //   setIsStarted(true);
  // }, []);

  return (
    <div className="w-screen h-screen bg-[#ff625d] flex justify-center items-center flex-col gap-4">
      <h1 className="text-3xl font-bold text-white">🐶🦊🐱🐹🐻🐰</h1>
      <h1 className="text-5xl font-bold text-white">내 동물상은?</h1>

      <div ref={webcamRef} className="overflow-hidden rounded-2xl"></div>
      <div ref={labelRef}></div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2 text-4xl">
          <div className="flex items-center gap-4">
            <h1 className="text-white">🐶</h1>
            <progress value={prediction.dog} max={1}></progress>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-white">🐱</h1>
            <progress value={prediction.cat} max={1}></progress>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-white">🐰</h1>
            <progress value={prediction.rabbit} max={1}></progress>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-white">🐹</h1>
            <progress value={prediction.hamster} max={1}></progress>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-white">🐻</h1>
            <progress value={prediction.bear} max={1}></progress>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-white">🦊</h1>
            <progress value={prediction.fox} max={1}></progress>
          </div>
        </div>
      </div>
      <img src="/Vector.svg" width={200} alt="" onClick={() => init()} />
      {/* <button onClick={() => init()}>-</button> */}
    </div>
  );
}

export default App;
