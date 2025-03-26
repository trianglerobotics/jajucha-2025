import { useState, useEffect } from 'react';
import Header from './components/Header';
import WiFi from './components/WiFi';
import MainBgImage from './assets/images/main-bg.svg';

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

    const interval = setInterval(fetchWifiInfo, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="h-screen flex flex-col text-white min-w-[960px]"
      style={{ backgroundImage: `url(${MainBgImage})`, backgroundSize: 'cover' }}
    >
      {/* Header는 고정 높이 */}
      <div className="h-[60px] shrink-0">
        <Header wifiInfo={wifiInfo} />
      </div>

      {/* 아래 영역 전체 채우는 영역 */}
      <div className="flex-grow h-0">
        {(() => {
          const tpLink = wifiInfo?.find(item => item.interfaceName.startsWith("TP-Link"));
          return tpLink ? (
            <webview
              className="flex w-full h-full"
              src="http://172.30.1.16:5173/"
            />
          ) : (
            <WiFi />
          );
        })()}
      </div>
    </div>
  );
}

export default App;
