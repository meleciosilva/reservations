import { Link } from "react-router-dom";
import { formatAsDate, formatAsTime } from "../utils/date-time";

function ListReservations({ reservations, handleCancelReservation }) {

  function handleCancel(e) {
    e.preventDefault();
    const id = e.target.getAttribute("id");
    handleCancelReservation(id);
  }

  if (!reservations) return <h2>No reservations found</h2>;
  if (!reservations.length) return <h2>No reservations found</h2>;
  const validReservations = reservations.filter(reservation => reservation.status !== "cancelled");
  
  return (
    <div>
      <h2>Reservations</h2>

      <div className="row py-3">
        { validReservations.map((reservation, index) => (
          <div className="col-xs-12 col-sm-6 col-md-4" key={ index }>
            <div className="card mb-2 darkBorder">
              <div className="card-header d-flex justify-content-between">
                <h4 className="font-weight-bold">{ reservation.first_name } { reservation.last_name }</h4>
                <h4 className="font-weight-bold">Party: { reservation.people }</h4>
              </div>
              <div className="card-body">
                <p className="py-2 cardSize"><strong>Date</strong>: { formatAsDate(reservation.reservation_date) }</p>
                <p className="py-2 cardSize"><strong>Time</strong>: { formatAsTime(reservation.reservation_time) }</p>
                <p className="py-2 cardSize"><strong>Contact Number</strong>: { reservation.mobile_number }</p>
                <p className="py-2 cardSize" data-reservation-id-status={reservation.reservation_id}><strong>Status</strong>: { reservation.status && reservation.status.toUpperCase() }</p>
              </div>
              <div className="col mb-3">
                { reservation.status === "booked"
                  ? <div className="btn-group d-flex" role="group" aria-label="buttons">
                      <Link className="btn lightText darkBackground px-1" to={`/reservations/${reservation.reservation_id}/seat`}>Seat</Link>
                      <Link className="btn lightText accentBackground mx-1" to={`/reservations/${reservation.reservation_id}/edit`}>Edit</Link>
                      <button id={reservation.reservation_id} onClick={handleCancel} className="btn lightText accentBackground2 px-1" data-reservation-id-cancel={reservation.reservation_id}>Cancel</button>
                    </div>
                  : null
                }
              </div>
            </div>
          </div>
        )) }
      </div>
    </div>
  )
}

export default ListReservations;