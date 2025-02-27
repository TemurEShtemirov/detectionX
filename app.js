import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

async function startCamera() {
  try {
    video.src = "http://localhost:8080/http://192.168.0.169:4747/video"; // DroidCam
    video.play();
  } catch (error) {
    console.error("Error accessing DroidCam:", error);
  }
}

async function loadModel() {
  console.log("Loading COCO-SSD Model...");
  const model = await cocoSsd.load();
  console.log("Model loaded!");
  detectObjects(model);
}

async function detectObjects(model) {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  setInterval(async () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const predictions = await model.detect(video);

    predictions.forEach((prediction) => {
      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        prediction.bbox[0],
        prediction.bbox[1],
        prediction.bbox[2],
        prediction.bbox[3]
      );

      ctx.fillStyle = "#00FF00";
      ctx.fillText(
        `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
        prediction.bbox[0],
        prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
      );
    });
  }, 500);
}

startCamera();
loadModel();
