import { useState, useEffect } from 'react';

function App(): JSX.Element {
  const [wifiInfo, setWifiInfo] = useState<any>(null);

  useEffect(() => {
    async function fetchWifiInfo() {
      try {
        const data = await window.api.getWifiInfo();
        setWifiInfo(data);
      } catch (error) {
        console.error('Error fetching Wi-Fi info:', error);
      }
    }

    // 500ms interval
    const interval = setInterval(fetchWifiInfo, 500);
    return () => clearInterval(interval
    );
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1 className='bg-[3'>Wi-Fi Info</h1>
      {wifiInfo ? (
        <pre>{JSON.stringify(wifiInfo, null, 2)}</pre>
      ) : (
        <p className='bg-white'>Loading...</p>
      )}
    </div>
  );
}

export default App;
