const getBackendData = async () => {
    const response = await fetch('/');
    return response.json();
  };
  
  export default getBackendData;