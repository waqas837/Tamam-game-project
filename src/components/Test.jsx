import React, { useState } from "react";
import axios from "axios";

const Test = () => {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const handleChargeRequest = () => {
    const options = {
      method: "POST",
      url: "https://sandboxapi.upayments.com/api/v1/charge",// sandbox is a testing api
      // upayments will the production mode
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        // Authorization: "Bearer c124c9f8472dcd9e0c7597ddc1291d3f80a6c82d", // Replace with your actual token
        Authorization: "Bearer jtest123", 
      },
      data: {
        // Include any necessary data for the POST request here
      },
    };

    axios
      .request(options)
      .then((response) => {
        // it will give you a link of its UI TO perform payments for you
        // sandbox means only testing environments.
        setResponseData(response.data);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
        setResponseData(null);
      });
  };

  return (
    <div className="container">
      <button onClick={handleChargeRequest} className="btn">
        Make Charge Request
      </button>

      {responseData && (
        <div className="response">
          <h3>Response:</h3>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="error">
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Test;
