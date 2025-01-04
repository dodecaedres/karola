import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ReactMic } from "react-mic";
import axios from "axios";

const CameraButton = ({ onClick, icon, disabled, label, isActive }) => (
  <button
    onClick={onClick}
    className={`pointer-events-auto bg-white hover:bg-gray-100 text-blue-600 p-4 rounded-md shadow-md transition-all duration-200 ease-in-out flex items-center gap-2 ${
      disabled ? "cursor-not-allowed opacity-50" : ""
    } ${isActive ? "bg-gray-200" : ""}`}
    disabled={disabled}
    aria-pressed={isActive}
  >
    {icon}
    <span className="sr-only">{label}</span>
  </button>
);

CameraButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};


const TranslateButton = ({ onSend, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recorderTimeout = useRef(null);

  useEffect(() => {
    if (isRecording && !isListening) {
      setIsListening(true);
    }
  }, [isRecording, isListening]);

  const startRecording = () => {
    setIsRecording(true);
    setIsListening(true);
    if (recorderTimeout.current) {
      clearTimeout(recorderTimeout.current);
      recorderTimeout.current = null;
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsListening(false);
    if (recorderTimeout.current) {
      clearTimeout(recorderTimeout.current);
      recorderTimeout.current = null;
    }
  };

  const onData = (recordedBlob) => {
    if (recorderTimeout.current) {
      clearTimeout(recorderTimeout.current);
    }
    recorderTimeout.current = setTimeout(() => {
      setIsRecording(false);
    }, 2000);
  };

  const onStop = async (recordedBlob) => {
    const formData = new FormData();
    formData.append("file", recordedBlob.blob, "audio.mp3");

    try {
      // Envoie du fichier audio pour transcription
      const transcriptionResponse = await axios.post(
        "https://serveur-avatar.hexadecaedre.com:8443/upload-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const transcribedText = transcriptionResponse.data.text;
      console.log("Transcribed Text:", transcribedText);

      // Envoie du texte transcrit pour traduction via `translate`
      if (transcribedText) {
        onSend(transcribedText); // Envoie du texte transcrit à la fonction de callback `onSend`
      }

      if (isListening) {
        setIsRecording(true);
      }
    } catch (error) {
      console.error("Error during transcription or translation: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 pointer-events-auto max-w-screen-sm w-full mx-auto">
      <ReactMic
        record={isRecording}
        className="hidden"
        onStop={onStop}
        onData={onData}
        strokeColor="#000000"
        backgroundColor="#FFFFFF"
      />
      <CameraButton
        onClick={isListening ? stopRecording : startRecording}
        icon={
          isListening ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
              stroke="currentColor"
              className="w-6 h-6 text-grey-600"
            >
              <path d="M468.53 236.03H486v39.94h-17.47v-39.94zm-34.426 51.634h17.47v-63.328h-17.47v63.328zm-33.848 32.756h17.47V191.58h-17.47v128.84zm-32.177 25.276h17.47V167.483h-17.47v178.17zm-34.448-43.521h17.47v-92.35h-17.47v92.35zm-34.994 69.879h17.47v-236.06h-17.525v236.06zM264.2 405.9h17.47V106.1H264.2V405.9zm-33.848-46.284h17.47V152.383h-17.47v207.234zm-35.016-58.85h17.47v-87.35h-17.47v87.35zm-33.847-20.823h17.47V231.98h-17.47v48.042zm-33.848 25.66h17.47v-99.24h-17.47v99.272zm-33.302 48.04h17.47V152.678H94.34v201zm-33.847-30.702h17.47V187.333h-17.47v135.642zM26 287.664h17.47v-63.328H26v63.328z"/>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
              fill="none"
              role="img"
              aria-labelledby="languageIconTitle"
            >
              <title id="languageIconTitle">Language</title>
              <circle cx="12" cy="12" r="10" />
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12,22 C14.6666667,19.5757576 16,16.2424242 16,12 C16,7.75757576 14.6666667,4.42424242 12,2 C9.33333333,4.42424242 8,7.75757576 8,12 C8,16.2424242 9.33333333,19.5757576 12,22 Z"
              />
              <path strokeLinecap="round" d="M2.5 9L21.5 9M2.5 15L21.5 15" />
            </svg>
          )
        }
        label="Toggle recording"
        disabled={Boolean(disabled)}
        isActive={isListening}
      />
    </div>
  );
};

TranslateButton.propTypes = {
  onSend: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default TranslateButton;
