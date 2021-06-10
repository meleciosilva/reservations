import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { listReservationsByNumber } from "../utils/api";
import SearchBar from "./SearchBar";
import ListReservations from "../shared/ListReservations";
import ErrorAlert from "../shared/ErrorAlert";

function Search() {

  const [number, setNumber] = useState(null);
  const [reservations, setReservations] = useState(null);
  const [errors, setErrors] = useState(null);
  
  useEffect(fetchReservations, [number]);

  function fetchReservations() {
    const abortController = new AbortController();
    setErrors(null);
    listReservationsByNumber(number, abortController.signal)
      .then(setReservations)
      .catch(setErrors);
    return () => abortController.abort();
  }

  function handleFind(event, phoneNumber) {
    event.preventDefault();
    setNumber(phoneNumber);
  }

  return(
    <Switch>
      <Route exact={true} path="/search">
        <SearchBar handleFind={handleFind}/>
        <ErrorAlert errors={errors} />
        <ListReservations reservations={reservations}/>
      </Route>
    </Switch>
  )
}

export default Search;
