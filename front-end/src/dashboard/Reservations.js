import { Link } from "react-router-dom";

function Reservations({ reservations }) {
  
  if (!reservations) return null;
  return (
    <div>
      <h2>Reservations</h2>
      { reservations.map(reservation => (
        <div className="card mb-2" key={ reservation.reservation_id }>
          <div className="card-header d-flex justify-content-between">
            <h5 className="font-weight-bold">{ reservation.first_name } { reservation.last_name }</h5>
            <h5 className="font-weight-bold">Party: { reservation.people }</h5>
          </div>
          <div className="card-body">
            <h5 className="card-title">Time</h5>
            <p className="card-text">{ reservation.reservation_time }</p>
            <h5 className="card-title">Contact Number</h5>
            <p className="card-text">{ reservation.mobile_number }</p>
          </div>
          <div className="col-md-12 mb-2">
            <Link className="btn btn-success" to={`/reservations/${reservation.reservation_id}/seat`}>Seat</Link>
          </div>
        </div>
      )) }
    </div>
  )
}

export default Reservations;