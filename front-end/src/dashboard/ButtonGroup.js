import { previous, today, next } from "../utils/date-time";

function ButtonGroup({ date, handleDate }) {
  return (
    <div
      className="btn-group d-flex justify-content-around"
      role="group"
      aria-label="buttons"
    >
      <button
        type="button"
        className="btn lightText darkBackground px-1"
        onClick={() => handleDate(previous(date))}
      >
        Previous
      </button>
      <button
        type="button"
        className="btn lightText accentBackground mx-1"
        onClick={() => handleDate(today(date))}
      >
        Today
      </button>
      <button
        type="button"
        className="btn lightText darkBackground px-1"
        onClick={() => handleDate(next(date))}
      >
        Next
      </button>
    </div>
  );
}

export default ButtonGroup;
