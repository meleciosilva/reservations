import React from "react";

function ErrorAlert({ errors, isSubmit }) {
  
  if (!isSubmit) return null;
  return (
    errors && (
      <div className="alert alert-danger m-2">
        { errors.map((err, index) => (
            <div key={index} className="my-1" >Error: { err }</div>
          ))
        }
      </div>
    )
  );
}

export default ErrorAlert;
