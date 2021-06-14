import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../shared/ErrorAlert";

function Seat({ tables, handleUpdateTableAndReservation, errors }) {
  const [tableId, setTableId] = useState("");

  const history = useHistory();
  const { reservation_id } = useParams();

  function handleChange(e) {
    const selectedIndex = e.target.options.selectedIndex;
    const value = e.target.options[selectedIndex].getAttribute("id");
    setTableId(value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const reservationId = Number(reservation_id);
    handleUpdateTableAndReservation(reservationId, tableId);
  }

  if (!tables) return null;
  return (
    <div>
      <h1>Select A Table</h1>
      <hr />
      <ErrorAlert errors={errors} />

      <div className="row d-flex justify-content-center">
        <form className="col-xs-12 col-md-8 col-lg-6" onSubmit={handleSubmit}>
          <div className="mb-2">
            <select
              name="table_id"
              className="form-select"
              onChange={handleChange}
            >
              <option defaultValue>Open to Select a Table Number</option>
              {tables.map((table) => (
                <option key={table.table_id} id={table.table_id}>
                  {table.table_name} - {table.capacity}
                </option>
              ))}
            </select>
          </div>
          <div className="btn-group d-flex" role="group" aria-label="buttons">
            <button
              type="button"
              className="btn accentBackground2 lightText mr-1"
              onClick={() => history.goBack()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn darkBackground lightText ml-1"
              disabled={!tableId}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Seat;
