import './Preloader.css';

function Preloader({ onContinue, onCancel }) {
  return (
    <div className="preloader-overlay" onClick={onContinue}>
      <div className="preloader-spinner">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="preloader-bar"
            style={{
              transform: `rotate(${i * 30}deg)`,
              animationDelay: `${(i - 12) * 0.1}s`,
            }}
          />
        ))}
      </div>
      <p className="preloader-text">Loading... Please wait.</p>
      <div className="preloader-buttons" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="preloader-btn preloader-cancel"
          onClick={(event) => {
            event.stopPropagation();
            onCancel?.();
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="preloader-btn preloader-continue"
          onClick={(event) => {
            event.stopPropagation();
            onContinue?.();
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default Preloader;