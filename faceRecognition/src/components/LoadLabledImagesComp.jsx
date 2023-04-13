import '../App.css'
import * as faceapi from 'face-api.js'

async function LoadLabledImages() {
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

export default LoadLabledImages
