import React, { useEffect, useState } from 'react';
import PropertyForm from './properties';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/properties/latest')
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);
        localStorage.setItem('latestPropertyId', data.property_id);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="App">
      <h1>Real Estate</h1>
      <p>Welcome to my Real Estate</p>
      <p>{message}</p>
      <PropertyForm />
    </div>
  );
}

export default App;
