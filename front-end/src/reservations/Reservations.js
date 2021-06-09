import { Redirect, Route, Switch } from "react-router-dom";

import Seat from "./Seat";
import NewReservation from "./NewReservation";

function Reservations({ reservations, tables, handleUpdateTableAndReservation }) {

  return (
    <Switch>
      <Route exact={true} path="/reservations">
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Seat reservations={reservations} tables={tables} handleUpdateTableAndReservation={handleUpdateTableAndReservation}/>
      </Route>
      <Route path="/reservations/new">
        <NewReservation tables={tables} />
      </Route>
    </Switch>
  )
}

export default Reservations;