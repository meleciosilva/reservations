import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { fetchTables, seatReservation } from "../utils/api";

function Seat() {
  const { reservation_id } = useParams();
  const history = useHistory();
  const [tables, setTables] = useState(null);

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    fetchTables(abortController.signal)
      .then(setTables)
      .catch(console.log);
    return () => abortController.abort();
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("HEY")
    seatReservation(reservation_id);
    history.push("/dashboard");
  }
  
  return (
    <div className="row">
      <h1>Select A Table</h1>
      <hr />

      <form onSubmit={handleSubmit}>
        <div className="col-md-12 mb-2">
          <select name="table_id" className="form-select" aria-label="Default select example">
            <option defaultValue>Open to Select a Table Number</option>
            { tables && tables.map(table => <option key={table.table_id}>{table.table_name} - {table.capacity}</option>) }
          </select>
        </div>
        <div className="col-md-12">
          <button className="btn btn-secondary mr-2" onClick={ () => history.goBack() }>Cancel</button>
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default Seat;