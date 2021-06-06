import { Redirect, Route, Switch } from "react-router-dom";
import Seat from "./Seat";

import NewReservation from "./NewReservation";

function Reservations() {
  return (
    <Switch>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>
      <Route path="/reservations/new">
        <NewReservation />
      </Route>
    </Switch>
  )
}

export default Reservations;