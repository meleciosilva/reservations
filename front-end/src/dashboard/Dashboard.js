import ErrorAlert from "../layout/ErrorAlert";
import ButtonGroup from "./ButtonGroup";
import ListReservations from "../shared/ListReservations";
import ListTables from "./ListTables";

function Dashboard(props) {

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="my-4">
        <h2>Reservations for { props.date }</h2>
      </div>
      <ButtonGroup date={props.date} handleDate={props.handleDate}/>
      <ErrorAlert error={props.errors} />
      <ListTables tables={props.tables} handleFreeTableAndFinishReservation={props.handleFreeTableAndFinishReservation}/>
      <ListReservations reservations={props.reservations} handleCancelReservation={props.handleCancelReservation} />
    </main>
  );
}

export default Dashboard;
