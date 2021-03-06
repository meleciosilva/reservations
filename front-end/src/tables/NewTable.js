import { useState } from "react";
import { useHistory } from "react-router-dom";

function NewTable({ handleNewTable }) {
  const history = useHistory();
  const [state, setState] = useState({
    table_name: "",
    capacity: "",
  });

  function handleChange(e) {
    let value = e.target.value;

    if (e.target.name === "capacity") {
      value = Number(e.target.value);
    }

    setState({
      ...state,
      [e.target.name]: value,
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNewTable(state);
  };

  return (
    <div onSubmit={handleSubmit}>
      <h1>New Table</h1>
      <hr />

      <form className="row">
        <div className="col-xs-12 col-md-6 mb-3">
          <label htmlFor="table_name" className="form-label">
            Table Name
          </label>
          <input
            name="table_name"
            type="text"
            className="form-control"
            id="table_name"
            minLength="2"
            required
            value={state.table_name}
            onChange={handleChange}
          />
        </div>
        <div className="col-xs-12 col-md-6 mb-3">
          <label htmlFor="capacity" className="form-label">
            Capacity
          </label>
          <input
            name="capacity"
            type="number"
            className="form-control"
            id="capacity"
            min="1"
            required
            value={state.capacity}
            onChange={handleChange}
          />
        </div>
        <div className="btn-group d-flex" role="group" aria-label="buttons">
          <button
            type="button"
            className="btn btn accentBackground2 lightText mr-2"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn darkBackground lightText">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewTable;
