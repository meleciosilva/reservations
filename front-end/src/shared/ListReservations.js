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

      <div className="row">
        { validReservations.map((reservation, index) => (
          <div className="col-xs-12 col-md-6" key={ index }>
            <div className="card mb-2">
              <div className="card-header d-flex justify-content-between">
                <h5 className="font-weight-bold">{ reservation.first_name } { reservation.last_name }</h5>
                <h5 className="font-weight-bold">Party: { reservation.people }</h5>
              </div>
              <div className="card-body">
                <h5 className="card-title">When</h5>
                <p className="card-text">Date: { formatAsDate(reservation.reservation_date) }</p>
                <p className="card-text">Time: { formatAsTime(reservation.reservation_time) }</p>
                <h5 className="card-title">Contact Number</h5>
                <p className="card-text">{ reservation.mobile_number }</p>
                <h5 className="card-title">Status</h5>
                <p className="card-text" data-reservation-id-status={reservation.reservation_id} >{ reservation.status }</p>
              </div>
              <div className="col-md-12 mb-2">
                { reservation.status === "booked"
                  ? <div>
                      <Link className="btn btn-success mr-2" to={`/reservations/${reservation.reservation_id}/seat`}>Seat</Link>
                      <Link className="btn btn-primary mr-2" to={`/reservations/${reservation.reservation_id}/edit`}>Edit</Link>
                      <button id={reservation.reservation_id} onClick={handleCancel} className="btn btn-secondary" data-reservation-id-cancel={reservation.reservation_id}>Cancel</button>
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