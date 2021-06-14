import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { listReservationsByNumber, cancelReservation  } from "../utils/api";
import SearchBar from "./SearchBar";
import ListReservations from "../shared/ListReservations";
import ErrorAlert from "../shared/ErrorAlert";

function Search() {

  const [number, setNumber] = useState(null);
  const [reservations, setReservations] = useState(null);
  const [errors, setErrors] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false);
  
  useEffect(fetchReservations, [number, isCancelled]);

  function fetchReservations() {
    const abortController = new AbortController();
    setErrors(null);
    listReservationsByNumber(number, abortController.signal)
      .then(setReservations)
      .catch((err) => setErrors([err]));
    return () => abortController.abort();
  }

  function handleFind(event, phoneNumber) {
    event.preventDefault();
    setNumber(phoneNumber);
  }

  function handleCancelReservation(reservationId) {
    const confirmed = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
    if (confirmed) {
      cancelReservation(reservationId)
        .then(() => setIsCancelled(!isCancelled))
        .catch((err) => setErrors([err]));
      }
  }

  return(
    <Switch>
      <Route exact={true} path="/search">
        <SearchBar handleFind={handleFind}/>
        <ErrorAlert errors={errors} />
        <ListReservations reservations={reservations} handleCancelReservation={handleCancelReservation} />
      </Route>
    </Switch>
  )
}

export default Search;
