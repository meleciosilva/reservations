import { Redirect, Route, Switch } from "react-router-dom";

import Seat from "./Seat";
import ReservationForm from "./ReservationForm";

function Reservations(props) {
  const { tables, handleUpdateTableAndReservation, handleUpdateReservation, handleNewReservation } = props;
  return (
    <Switch>
      <Route exact={true} path="/reservations">
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Seat 
          tables={tables} 
          handleUpdateTableAndReservation={handleUpdateTableAndReservation}
        />
      </Route>
      <Route path={["/reservations/:reservation_id/edit", "/reservations/new"]}>
        <ReservationForm
          handleNewReservation={handleNewReservation}
          handleUpdateReservation={handleUpdateReservation}
        />
      </Route>
    </Switch>
  )
}

export default Reservations;