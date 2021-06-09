import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { listReservations, fetchTables, deleteTable } from "../utils/api";
import { today } from "../utils/date-time";
import useQuery from "./../utils/useQuery";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Reservations from "../reservations/Reservations";
import Tables from "../tables/Tables";
import NotFound from "./NotFound";

function Routes() {
  
  const query = useQuery();
  const history = useHistory();

  const [reservations, setReservations] = useState([]);
  const [errors, setErrors] = useState(null);
  const [tables, setTables] = useState(null);
  // sets date to date found in query or today's date by default
  const [date, setDate] = useState(query.get("date") || today());
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(fetchAll, [date, isSubmit]);

  function fetchAll() {
    const abortController = new AbortController();
    setErrors(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .then(() => fetchTables(abortController.signal))
      .then(setTables)
      .catch(setErrors);
    return () => abortController.abort();
  }

  // click handlers

  function handleDate(newDate) {
    setDate(newDate);
  }

  function handleNewTable(newTable) {
    setTables(prevState => [...prevState, newTable]);
  }

  function handleUpdateTableAndReservation(updatedReservation, tableId) {
    const table = tables.find(table => Number(table.table_id) === Number(tableId));
    const tableIndex = tables.indexOf(table);
    const updatedTable = { ...table, reservation_id: updatedReservation.reservation_id };
    
    setTables(prevState => {
      prevState.splice(tableIndex, 1, updatedTable);
      return prevState;
    })
    setIsSubmit(!isSubmit);
  }

  function handleFreeTableAndFinishReservation(tableId) {
    const confirmed = window.confirm("Is this table ready to seat new guests? This cannot be undone.");
    if (confirmed) {
      deleteTable(tableId)
        .then(() => {
          const table = tables.find(table => Number(table.table_id) === Number(tableId));
          const reservationIndex = reservations.findIndex(res => Number(res.reservation_id) === Number(table.reservation_id));
          setReservations(prevState => {
            prevState.splice(reservationIndex, 1);
            return prevState;
          })
        })
        .then(() => setTables(prevState => {
          const table = prevState.find(table => Number(table.table_id) === Number(tableId));
          table.reservation_id = null;
          return prevState;
        }))
        .then(() => fetchTables())
        .then(() => setIsSubmit(!isSubmit))
        .then(() => history.push(`/dashboard?date=${date}`))
        .catch(setErrors)
    }
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard 
          date={date} handleDate={handleDate}
          errors={errors} reservations={reservations}
          tables={tables} 
          handleFreeTableAndFinishReservation={handleFreeTableAndFinishReservation} 
        />
      </Route>
      <Route path="/reservations">
        <Reservations 
          reservations={reservations} 
          tables={tables} 
          handleUpdateTableAndReservation={handleUpdateTableAndReservation} 
        />
      </Route>
      <Route path="/tables">
        <Tables 
          reservations={reservations} 
          tables={tables} 
          handleNewTable={handleNewTable} 
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
