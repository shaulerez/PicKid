import { useEffect, useRef, useState } from 'react'
import testImage from '../../TestImage/TestNettaInTheKindergarden.jpeg'
import * as faceapi from 'face-api.js'
import '../App.css'
import MainPage from './MainPage'

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

function LoadNewPhoto(props) {
  let image = props.image
  let updatedWidth = image.width;
  let updatedHeight = image.height;
  let scaleFactor = updatedWidth > updatedHeight ? updatedWidth / 1000 : updatedHeight / 800;
  updatedWidth /= scaleFactor;
  updatedHeight /= scaleFactor;  
   
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
      width: updatedWidth,
      height: updatedHeight,
    })

    const resizedDetections = faceapi.resizeResults(detections, {
      width: updatedWidth,
      height: updatedHeight,
    })
    
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {label: result.label.toString()});
      drawBox.draw(canvasRef.current);
    });
  }
  
  const HandelGoBackClick = () =>{
    props.handleGoBack()
  }
  
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
    <div>
      <div className="loadNewPhoto">
        <img 
          crossOrigin="anonymous"
          ref={imgRef}
          src={image.url}  
          alt=""
          width={updatedWidth}
          height={updatedHeight} 
        />
        <canvas ref={canvasRef} width={updatedWidth} height={updatedHeight}/>
      </div>
      <div className='backToMainPage'>
        <button style={{height: "50px", alignSelf: "center"}} onClick={HandelGoBackClick}>Back To Main Page</button>
      </div>
    </div>
    

  )
}

export default LoadNewPhoto
