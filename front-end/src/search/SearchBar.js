import { useState } from "react";

function SearchBar({ handleFind }) {  
  
  const [phoneNumber, setPhoneNumber] = useState("");

  function handleChange(e) {
    const value = e.target.value;
    setPhoneNumber(value);
  }
  
  return (
    <div>
      <form onSubmit={(event) => handleFind(event, phoneNumber)} className="d-flex w-100 my-4">
        <input name="mobile_number" className="form-control me-2" type="search" placeholder="Enter a customer's phone number" value={phoneNumber} onChange={handleChange} aria-label="Search" />
        <button type="submit" className="btn btn-success">Find</button>
      </form>
    </div>
  );
}

export default SearchBar;