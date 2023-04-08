import { useEffect, useState } from 'react';
import '../App.css'
import LoadNewPhoto from './LoadNewPhoto';

function MainPage() {
  const [file, setFile] = useState()
  const [image, setImage] = useState()

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
  
  return (
    <div>
      {image ? <LoadNewPhoto image={image}/> :
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


        {/* <LoadNewPhoto/> */}
      </div>
      }
    </div>
  )
}

export default MainPage
