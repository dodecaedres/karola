import PropTypes from "prop-types";

const CaptureButton = ({ onClick, icon, disabled, label, isActive }) => {
  const handleClick = () => {
    // Créer un nouvel objet Audio et jouer le son
    const audio = new Audio('/sounds/photo.mp3');
    audio.play();

    // Appeler la fonction onClick si elle est définie
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`pointer-events-auto bg-white hover:bg-gray-100 text-blue-600 p-4 rounded-md shadow-md transition-all duration-200 ease-in-out flex items-left justify-left gap-1 ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      } ${isActive ? "bg-gray-200" : ""}`}
      disabled={disabled}
      aria-pressed={isActive}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
};

CaptureButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};

export default CaptureButton;
