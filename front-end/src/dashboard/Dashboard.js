import ErrorAlert from "../layout/ErrorAlert";
import ButtonGroup from "./ButtonGroup";
import ListReservations from "./ListReservations";
import ListTables from "./ListTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard(props) {

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for { props.date }</h4>
      </div>
      <ButtonGroup date={props.date} handleDate={props.handleDate}/>
      <ErrorAlert error={props.errors} />
      <ListTables tables={props.tables} handleFinish={props.handleFinish}/>
      <ListReservations reservations={props.reservations} />
    </main>
  );
}

export default Dashboard;
