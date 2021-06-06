import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import { today } from "../utils/date-time";
import useQuery from "./../utils/useQuery";

import ErrorAlert from "../layout/ErrorAlert";
import ButtonGroup from "./ButtonGroup";
import Reservations from "./Reservations";
import Tables from "./Tables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const query = useQuery();

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  // sets date to date found in query or today's date by default
  const [date, setDate] = useState(query.get("date") || today());
  

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function handleDate(newDate) {
    setDate(newDate);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for { date }</h4>
      </div>
      <ButtonGroup date={date} handleDate={handleDate}/>
      <ErrorAlert error={reservationsError} />
      <Tables />
      <Reservations reservations={reservations} />
    </main>
  );
}

export default Dashboard;
