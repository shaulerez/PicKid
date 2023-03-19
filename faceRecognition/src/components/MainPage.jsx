import { useEffect, useRef, useState } from 'react'
import testImage from '../../TestImage/Test1.jpeg'
import * as faceapi from 'face-api.js'
import '../App.css'

function loadLabledImages() {
  const labels = ['Maayan', 'Neta', 'Noam'];
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 3; ++i)
      {
        const img = await faceapi.fetchImage('../../labeledImages/' + label +'/' + label + i + '.jpeg')
        const detections = await faceapi.detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  )
}

function MainPage() {
  const [count, setCount] = useState(0)
  const imgRef = useRef();
  const canvasRef = useRef();
  
  const handleImage = async () =>{

    const labeledFaceDescriptors = await loadLabledImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
    
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
    
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {label: result.toString()});
      drawBox.draw(canvasRef.current);
    });
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
    <div className="mainPage">
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

export default MainPage
