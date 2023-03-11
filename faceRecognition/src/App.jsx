import { useEffect, useRef, useState } from 'react'
import testImage from '../TestImage/Test1.jpeg'
import * as faceapi from '../node_modules/face-api.js'
import './App.css'

function loadLabledImages() {
  const lables = ['Maayan', 'Neta', 'Noam']
}

function App() {
  const [count, setCount] = useState(0)
  const imgRef = useRef();
  const canvasRef = useRef();
  
  const handleImage = async () =>{
    const detections = await faceapi.detectAllFaces(imgRef.current  )
    .withFaceLandmarks()
    .withFaceDescriptors();
  
    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
    faceapi.matchDimensions(canvasRef.current, {
      width: 940,
      height: 650,
    })

    const resizedDetections = faceapi.resizeResults(detections, {
      width: 940,
      height: 650,
    })
    
    resizedDetections.forEach(detection => {
      const box = detection.detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {label: 'Face'});
      drawBox.draw(canvasRef.current);
    });
    //faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
    // faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);

  }
  
  
  console.log(faceapi.nets)
  useEffect(()=>{
    const loadModels = () =>{
      Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ])
      .then(handleImage)
      .catch((e)=> console.log(e))
    };
    
    imgRef.current && loadModels()
  },[])
  return (
    <div className="app">
      <img 
        crossOrigin="anonymous"
        ref={imgRef}
        src={testImage}  
        alt=""
        width="940"
        height="650" 
      />
      <canvas ref={canvasRef} width="940" height="650"/>
  
    </div>
  )
}

export default App
