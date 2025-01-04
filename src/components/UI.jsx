import { useRef, useState } from "react";
import PropTypes from "prop-types"; 
import { useChat } from "../hooks/useChat";
import MicButton from "./MicButton";
import { Header } from './Textzone';  
import CameraButton from './CameraButton';
import CaptureButton from './CaptureButton';
import TranslateButton from './TranslateButton'; // Import the TranslateButton component
import '../ui.css';  // Import the CSS

export const UI = ({ hidden, ...props }) => {
  const { chat, translate, loading, messages = [] } = useChat();
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const sendMessage = (text, source) => {
    if (!loading && text) {
      if (source === "translate") {
        translate(text);  // Utilise translate pour les messages traduits
      } else {
        chat(text);  // Utilise chat pour les messages de conversation
      }
    }
  };

  const toggleCamera = () => {
    if (!cameraActive) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
          .then(function(stream) {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.style.display = 'block';
            }
            setCameraActive(true);
          })
          .catch(function(error) {
            console.error('Erreur lors de l\'accès à la caméra :', error);
          });
      } else {
        alert('Votre appareil ne prend pas en charge la capture vidéo.');
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        let stream = videoRef.current.srcObject;
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.style.display = 'none';
        setCameraActive(false);
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const desiredWidth = 150;  // Desired width for captured image
      const desiredHeight = 150; // Desired height for captured image
  
      canvasRef.current.width = desiredWidth;
      canvasRef.current.height = desiredHeight;
  
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, desiredWidth, desiredHeight);
  
      canvasRef.current.toBlob(async (blob) => {
        await uploadPhoto(blob);
      }, "image/jpeg");
    }
  };

  const uploadPhoto = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "photo.jpg");
  
    try {
      const response = await fetch("https://serveur-avatar.hexadecaedre.com:8443/vision", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
  
      if (data.message) {
        console.log(`Vision Analysis: ${data.message.text}`);
        sendMessage(data.message.text, "vision");  // Utilise chat avec la source "vision"
      } else {
        console.log("Vision Analysis: undefined");
        sendMessage("Vision Analysis: undefined", "vision");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      sendMessage("Error uploading photo.", "vision");
    }
  };
  
  if (hidden) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-10 flex flex-col justify-between pointer-events-none">
      <Header />
      <div className="flex justify-center items-center space-x-2 mb-4 pointer-events-auto">
        <TranslateButton onSend={(text) => sendMessage(text, "translate")} disabled={loading} /> {/* New Translate Button */}
        <MicButton onSend={(text) => sendMessage(text, "chat")} disabled={loading} />
        <CameraButton
          onClick={toggleCamera}
          icon={
            <svg
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 76 76"
              stroke="currentColor"
              fill="currentColor"
              className="w-6 h-6"
              style={{ enableBackground: "new 0 0 76 76" }}
              xml:space="preserve"
            >
              <g id="_x37_7_Essential_Icons_72_">
                <path
                  id="Video_Camera"
                  d="M72.9,14.4L56,25.3V22c0-4.4-3.6-8-8-8H8c-4.4,0-8,3.6-8,8v32c0,4.4,3.6,8,8,8h40c4.4,0,8-3.6,8-8v-3.3
                  l16.9,10.9c1.9,1,3.1-0.7,3.1-1.7V16C76,15,74.9,13.2,72.9,14.4z M52,54c0,2.2-1.8,4-4,4H8c-2.2,0-4-1.8-4-4V22c0-2.2,1.8-4,4-4h40
                  c2.2,0,4,1.8,4,4V54z M72,56.3L56,46V30l16-10.3V56.3z"
                />
              </g>
            </svg>
               }
            label={cameraActive ? "Arrêter appareil photo" : "Activer appareil photo"}
            isActive={cameraActive}
          />
          <CaptureButton
            onClick={capturePhoto}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 487 487"
                fill="currentColor"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <g>
                  <g>
                    <path d="M308.1,277.95c0,35.7-28.9,64.6-64.6,64.6s-64.6-28.9-64.6-64.6s28.9-64.6,64.6-64.6S308.1,242.25,308.1,277.95z
                M440.3,116.05c25.8,0,46.7,20.9,46.7,46.7v122.4v103.8c0,27.5-22.3,49.8-49.8,49.8H49.8c-27.5,0-49.8-22.3-49.8-49.8v-103.9
                v-122.3l0,0c0-25.8,20.9-46.7,46.7-46.7h93.4l4.4-18.6c6.7-28.8,32.4-49.2,62-49.2h74.1c29.6,0,55.3,20.4,62,49.2l4.3,18.6H440.3z
                M97.4,183.45c0-12.9-10.5-23.4-23.4-23.4c-13,0-23.5,10.5-23.5,23.4s10.5,23.4,23.4,23.4C86.9,206.95,97.4,196.45,97.4,183.45z
                M358.7,277.95c0-63.6-51.6-115.2-115.2-115.2s-115.2,51.6-115.2,115.2s51.6,115.2,115.2,115.2S358.7,341.55,358.7,277.95z"/>
                  </g>
                </g>
              </svg>
            }
            label="Prendre une photo"
            isActive={cameraActive}
          />
      </div>
      <video 
        ref={videoRef} 
        className="video-top-right" 
        autoPlay 
        style={{ display: cameraActive ? 'block' : 'none' }}
      ></video>
      <canvas 
        ref={canvasRef} 
        className="hidden" 
        width="640" 
        height="480" 
      ></canvas>
    </div>
  );
};

UI.propTypes = {
  hidden: PropTypes.bool,
};
