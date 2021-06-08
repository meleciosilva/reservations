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

  useEffect(fetchAll, [date]);

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

  function handleDate(newDate) {
    setDate(newDate);
  }

  function handleNewTable(newTable) {
    setTables(prevState => [...prevState, newTable]);
  }

  function handleUpdateTable(updatedTable) {
    const index = tables.findIndex(table => Number(table.table_id) === Number(updatedTable.table_id));
    setTables(prevState => {
      prevState.splice(index, 1, updatedTable);
      return tables;
    });
  }

  function handleFinish(tableId) {
    const confirmed = window.confirm("Is this table ready to seat new guests? This cannot be undone.");
    if (confirmed) {
      deleteTable(tableId)
        .then(() => setTables(prevState => {
          const table = tables.find(table => Number(table.table_id) === Number(tableId));
          table.reservation_id = null;
          return tables;
        }))
        .then(() => history.push(`/dashboard?date=${date}`))
        .then(() => fetchTables())
        .catch(setErrors)
    }
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} handleDate={handleDate} errors={errors} reservations={reservations} tables={tables} handleFinish={handleFinish} />
      </Route>
      <Route path="/reservations">
        <Reservations reservations={reservations} tables={tables} handleUpdateTable={handleUpdateTable} />
      </Route>
      <Route path="/tables">
        <Tables reservations={reservations} tables={tables} handleNewTable={handleNewTable} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
