import React from "react";

function ErrorAlert({ errors }) {
  return (
    errors && (
      <div className="alert alert-danger m-2">
        {errors.map((err, index) => (
          <div key={index} className="my-1">
            {err.message}
          </div>
        ))}
      </div>
    )
  );
}

export default ErrorAlert;
