import { previous, today, next } from "../utils/date-time";

function ButtonGroup({ date, handleDate }) {
  return (
    <div class="btn-group d-flex justify-content-around pb-2" role="group" aria-label="Basic example">
      <button type="button" className="btn btn-dark" onClick={ () => handleDate(previous(date)) }>Previous</button>
      <button type="button" className="btn btn-success" onClick={ () => handleDate(today(date)) }>Today</button>
      <button type="button" className="btn btn-dark" onClick={ () => handleDate(next(date)) }>Next</button>
    </div>
  )
}

export default ButtonGroup;