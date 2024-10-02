"use client";
import React, { useState, useEffect } from 'react';

const AddressPage = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer 7pTf7h9BZgf9JFy3ssZbs2DQ");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch("https://upfrica-staging.herokuapp.com/api/v1/addresses", requestOptions)
            .then((response) => response.json()) // Parse the response as JSON
            .then((result) => setData(result.addresses))   // Set the data to state
            .catch((error) => setError(error));  // Set any errors to state
    }, []); // Empty dependency array to run only once

  

    return (
        <div>
            <h1>This is address page</h1>
            <div>{data.map(item => <p>{item.full_name}</p>)}</div>

          
        </div>
    );
};

export default AddressPage;
