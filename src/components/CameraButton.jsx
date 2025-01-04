import PropTypes from "prop-types";

const CameraButton = ({ onClick, icon, disabled, label, isActive }) => (
  <button
    onClick={onClick}
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

CameraButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};

export default CameraButton;
