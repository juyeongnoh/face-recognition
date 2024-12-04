import { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import Progress from "./components/Progress";

const App = () => {
  const [maleModel, setMaleModel] = useState(null);
  const [femaleModel, setFemaleModel] = useState(null);

  const [gender, setGender] = useState("M");
  const [file, setFile] = useState(null);

  const maleModelURL =
    "https://teachablemachine.withgoogle.com/models/P69LMB8FG/";
  const femaleModelURL =
    "https://teachablemachine.withgoogle.com/models/YGkYUyopw/";

  const [isLoadingModel, setIsLoadingModel] = useState(true);

  const [prediction, setPrediction] = useState({
    rabbit: 0,
    cat: 0,
    dog: 0,
    hamster: 0,
    bear: 0,
    fox: 0,
  });

  const inputCaptureRef = useRef(null);
  const inputRef = useRef(null);

  const handleGenderChange = (e) => setGender(e.target.value);
  const handleFileUpload = (e) => setFile(e.target.files[0]);

  const loadModel = async () => {
    setIsLoadingModel(true);

    const maleModelTopology = maleModelURL + "model.json";
    const maleModelMetadata = maleModelURL + "metadata.json";

    const femaleModelTopology = femaleModelURL + "model.json";
    const femaleModelMetadata = femaleModelURL + "metadata.json";

    const mModel = await tmImage.load(maleModelTopology, maleModelMetadata);
    const fModel = await tmImage.load(femaleModelTopology, femaleModelMetadata);

    setMaleModel(mModel);
    setFemaleModel(fModel);

    setIsLoadingModel(false);
  };

  const predict = async () => {
    const image = new Image();

    image.addEventListener("load", async () => {
      const model = gender === "M" ? maleModel : femaleModel;
      const predictions = await model.predict(image);

      for (const prediction of predictions) {
        setPrediction((prev) => ({
          ...prev,
          [prediction.className]: prediction.probability,
        }));
      }
    });

    image.src = URL.createObjectURL(file);
  };

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    if (file) {
      predict();
    }
  }, [file, gender]);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-4">
      <h1 className="text-3xl font-bold">🐶🦊🐱🐹🐻🐰</h1>
      <h1 className="text-4xl font-bold text-[#ff625d]">AI 동물상 테스트</h1>

      {file && (
        <img
          width={200}
          height={200}
          src={URL.createObjectURL(file)}
          alt="image to predict"
        />
      )}

      {!isLoadingModel && (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl">🐶</h1>
              <Progress value={prediction.dog} max={1} />
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl">🦊</h1>
              <Progress value={prediction.fox} max={1} />
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl">🐱</h1>
              <Progress value={prediction.cat} max={1} />
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl">🐹</h1>
              <Progress value={prediction.hamster} max={1} />
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl">🐻</h1>
              <Progress value={prediction.bear} max={1} />
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl">🐰</h1>
              <Progress value={prediction.rabbit} max={1} />
            </div>
          </div>

          <label>
            <input
              type="radio"
              value="M"
              checked={gender === "M"}
              onChange={handleGenderChange}
            />
            남자
          </label>

          <label>
            <input
              type="radio"
              value="F"
              checked={gender === "F"}
              onChange={handleGenderChange}
            />
            여자
          </label>

          <div className="flex gap-4">
            <button
              className="p-4 bg-rose-50 rounded-lg text-[#ff625d] font-semibold"
              onClick={() => inputCaptureRef.current.click()}>
              사진 찍기
            </button>

            <button
              className="p-4 bg-rose-50 rounded-lg text-[#ff625d] font-semibold"
              onClick={() => inputRef.current.click()}>
              사진첩에서 가져오기
            </button>
          </div>

          <input
            ref={inputCaptureRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleFileUpload}
            hidden
          />

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            hidden
          />
        </>
      )}
    </div>
  );
};

export default App;
