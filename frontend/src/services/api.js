const getBackendData = async () => {
    const response = await fetch('/api');
    const data = await response.text(); // Using text() because the backend sends text data
    return data;
  };
  
  export default getBackendData;
  