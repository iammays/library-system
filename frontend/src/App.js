import React, { useEffect, useState } from 'react';
import getBackendData from './services/api';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    getBackendData().then(data => setData(data));
  }, []);

  return (
    <div>
      <h1>Library System</h1>
      <p>{data}</p>
    </div>
  );
}

export default App;
