import { useEffect, useState } from 'react';
import '../App.css'
import LoadNewPhoto from './LoadNewPhoto';
import * as faceapi from 'face-api.js'
import LoadLabledImages from './LoadLabledImagesComp';


function MainPage() {
  const [file, setFile] = useState()
  const [image, setImage] = useState()
  const [modelsLoaded, setModelsLoaded] = useState()
  const [labeledImagesLoaded, setlabeledImagesLoaded] = useState()
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState()
  
  // Load faceapi relevant models once when the app is up, then load all existing images into model
  useEffect(()=>{
    const LoadModels = () =>{
      Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ])
      .then(() => {
        setModelsLoaded(true)
        LoadExistingLabeledImages()
      })
      .catch((e)=> console.error(e))
    };
    
    LoadModels()
  },[])
  
  // Load labeled Images, then save descriptors and update bool for GUI
  const LoadExistingLabeledImages = () => {
    LoadLabledImages()
        .then(data => {
          setLabeledFaceDescriptors(data)
          return true
        })
        .then(bool => setlabeledImagesLoaded(bool))
        .catch(error => console.error(error));  
  }

  // Get the image every time the selected file is changed
  useEffect(()=>{
    const getImage = ()=>{
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        setImage({
          url: img.src,
          width: img.width,
          height: img.height
        })
        console.log(img.width, img.height)
      }
    }

    file && getImage();
  },[file])

  // Handle back to main page from child components
  const HandleGoBack = () =>{
    setImage(null)
  }


  return (
    <div>
      {modelsLoaded ?
        <div>
          {labeledImagesLoaded ?
          <div>
            {image ? <LoadNewPhoto image={image} handleGoBack={HandleGoBack} labeledFaceDescriptors={labeledFaceDescriptors}/> :
            <div className='mainPage'>
              <div className="appHeader">Pickey</div>
              <div className='loadPhoto '>
                <label htmlFor="file">
                  <img 
                    className='uploadImg' src="../../images/upload image icon.png" alt="" />
                </label>
                <input onChange={e=>setFile(e.target.files[0])} id= "file" style={{display:"none"}} type="file" />
                <button>Load</button>
              </div>
            </div>
            }
          </div>
          : <p style={{color:'blue', fontSize:'24', textAlign:'center'}}>Loading Labeled Images...</p>
          }
        </div>
      : <p style={{color:'blue', fontSize:'24', textAlign:'center'}}>Loading Models...</p> 
      }
    </div>
  )
}

export default MainPage
