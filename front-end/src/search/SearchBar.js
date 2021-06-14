import { useState } from "react";

function SearchBar({ handleFind }) {
  const [phoneNumber, setPhoneNumber] = useState("");

  function handleChange(e) {
    const value = e.target.value;
    setPhoneNumber(value);
  }

  return (
    <div className="row d-flex justify-content-center">
      <form
        onSubmit={(event) => handleFind(event, phoneNumber)}
        className="col-xs-12 col-md-8 col-lg-6 pb-3"
      >
        <div className="d-flex">
          <input
            name="mobile_number"
            className="form-control me-2"
            type="search"
            placeholder="Enter a customer's phone number"
            value={phoneNumber}
            onChange={handleChange}
            aria-label="Search"
          />
          <button type="submit" className="btn darkBackground lightText ml-1">
            Find
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
