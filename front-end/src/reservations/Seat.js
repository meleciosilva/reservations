import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { seatReservation } from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function Seat({ tables, handleUpdateTable }) {
  const [tableId, setTableId] = useState("");
  const [errors, setErrors] = useState(null);
  
  const history = useHistory();
  const { reservation_id } = useParams();

  function handleChange(e) {
    const selectedIndex = e.target.options.selectedIndex;
    const value = e.target.options[selectedIndex].getAttribute('id');
    setTableId(value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    seatReservation(reservation_id, tableId)
      .then((updatedTables) => updatedTables[0])
      .then((handleUpdateTable))
      .then(() => history.push("/dashboard"))
      .catch(err => setErrors(err))
  }
  
  return (
    <div className="row">
      <h1>Select A Table</h1>
      <hr />
      <ErrorAlert errors={errors} />

      <form onSubmit={handleSubmit}>
        <div className="col-md-12 mb-2">
          <select name="table_id" className="form-select" aria-label="Default select example" value={tableId} onChange={handleChange}>
            <option>Open to Select a Table Number</option>
            { tables && tables.map(table => <option key={table.table_id} id={table.table_id}>{table.table_name} - {table.capacity}</option>) }
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