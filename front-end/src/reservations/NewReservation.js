import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "./ErrorAlert";


function NewReservation() {
  const history = useHistory();

  const [newReservationsErrors, setNewReservationsErrors] = useState(null);
  const [isSubmit, setIsSubmit] = useState(null);
  const [state, setState] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    people: "",
    reservation_date: "",
    reservation_time: "",
  });

  useEffect(handleErrors, [state.reservation_date, state.reservation_time]);
  
  function handleErrors() {
    setIsSubmit(null); // removes error messages
    const errors =[];
    const day = new Date(state.reservation_date).getUTCDay();
    const time = state.reservation_time;
    const date = state.reservation_date;
    const currentTime = Date.now();
    
    if (day === 2 ) {
      errors.push("Sorry, we are closed on Tuesdays")
    }
    if ( date && (currentTime > Date.parse(`${date} ${time}`)) ) {
      errors.push("You cannot make a reservation in the past. Select a future date.");
    }

    if (time < "10:30" || time > "21:30") {
      errors.push("Please make a reservation between 10:30am - 9:30pm");
    }
    
    if (errors.length >= 1) {
      setNewReservationsErrors(errors);
    } else {
      setNewReservationsErrors(null);
    }

  }

  function handleChange(e) {
    let value = e.target.value;
    
    if (e.target.name === "people") {
      value = Number(e.target.value);
    }

    setState({
      ...state,
      [e.target.name]: value
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    if (!newReservationsErrors) {
      createReservation(state);
      history.push(`/dashboard?date=${state.reservation_date}`);
    }
  }
  
  return (
    <div>
      <h1>New Reservation</h1>
      <hr />

      <ErrorAlert errors={newReservationsErrors} isSubmit={isSubmit} />

      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label htmlFor="first_name" className="form-label">First Name</label>
          <input name="first_name" type="text" className="form-control" id="first_name" placeholder="John" required minLength="2" maxLength="20" value={state.first_name} onChange={handleChange}/>
        </div>
        <div className="col-md-6">
          <label htmlFor="last_name" className="form-label">Last Name</label>
          <input name="last_name" type="text" className="form-control" id="last_name" placeholder="Doe" required minLength="2" maxLength="20" value={state.last_name} onChange={handleChange}/>
        </div>
        <div className="col-6">
          <label htmlFor="mobile_number" className="form-label">Mobile Number</label>
          <input name="mobile_number" type="tel" className="form-control" id="mobile_number" placeholder="123-456-7890" required pattern="^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$" title="mobile number must have at least 10 digits" value={state.mobile_number} onChange={handleChange}/>
          <small>Format: 123-456-7890</small>
        </div>
        <div className="col-6">
          <label htmlFor="people" className="form-label">Party Size</label>
          <input name="people" type="number" className="form-control" id="people" placeholder="5" required min="1" value={state.people} onChange={handleChange}/>
        </div>
        <div className="col-6">
          <label htmlFor="reservation_date" className="form-label">Date</label>
          <input name="reservation_date" type="date" className="form-control" id="reservation_date" placeholder="YYYY-MM-DD" required value={state.reservation_date} onChange={handleChange}/>
        </div>
        <div className="col-md-6">
          <label htmlFor="reservation_time" className="form-label">Time</label>
          <input name="reservation_time" type="time" className="form-control" id="reservation_time" placeholder="HH:MM" value={state.reservation_time} onChange={handleChange}/>
          <small>Hours 10:30am - 10:30pm | <strong>Last reservation at 9:30pm</strong></small>
        </div>
        <div className="col-12">
          <button className="btn btn-secondary mr-2" onClick={ () => history.goBack() }>Cancel</button>
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
      
    </div>
  )
}

export default NewReservation;