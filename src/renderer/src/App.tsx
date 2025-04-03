import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import WiFi from './components/WiFi';
import MainBgImage from './assets/images/main-bg.jpg';

function App(): JSX.Element {
  const [wifiInfo, setWifiInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const webviewRef = useRef<HTMLWebViewElement | null>(null);

  // Wi-Fi 정보 주기적으로 가져오기
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

  

  // webview 이벤트 등록
  useEffect(() => {
    const webview = webviewRef.current as any;
    if (!webview) return;

    const baseWidth = 1920;
    const currentWidth = window.innerWidth;
    const zoomFactor = currentWidth / baseWidth;

    const onDidFinishLoad = () => {
      console.log('✅ Webview finished loading');
      webview.setZoomFactor?.(zoomFactor);
      setLoading(false);
    };

    const onDidFailLoad = () => {
      console.warn('❌ Webview failed to load.');
      setLoading(false); // 로딩 실패해도 스피너는 꺼줌
    };


    webview.addEventListener('did-finish-load', onDidFinishLoad);
    webview.addEventListener('did-fail-load', onDidFailLoad);

    return () => {
      webview.removeEventListener('did-finish-load', onDidFinishLoad);
      webview.removeEventListener('did-fail-load', onDidFailLoad);
    };
  }, [wifiInfo]);


  useEffect(() => {
    const handleResize = () => {
      const webview = webviewRef.current as any;
      if (!webview) return;
  
      const baseWidth = 1920;
      const currentWidth = window.innerWidth;
      const zoomFactor = currentWidth / baseWidth;
      webview.setZoomFactor?.(zoomFactor);
      console.log(`🔍 ZoomFactor updated to ${zoomFactor}`);
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  

  useEffect(() => {
    const tpLink = wifiInfo?.find(
      item =>
        item.interfaceName?.startsWith('TP-Link') &&
        item.ssid?.includes('jajucha')
    );
    if(!tpLink) 
    {
      setLoading(true); // TP-Link Wi-Fi가 없으면 로딩 스피너 꺼줌
    }

  }
  , [wifiInfo]);

  return (
    <div
      className="h-screen flex flex-col text-white min-w-[960px]"
      style={{ backgroundImage: `url(${MainBgImage})`, backgroundSize: 'cover' }}
    >
      {/* Header 영역 */}
      <div className="h-[60px] shrink-0">
        <Header wifiInfo={wifiInfo} />
      </div>

      {/* WebView 또는 WiFi 안내 */}
      <div className="flex-grow h-0 relative">
        {(() => {
          const tpLink = wifiInfo?.find(
            item =>
              item.interfaceName?.startsWith('TP-Link') &&
              item.ssid?.includes('jajucha')
          );

          if (!tpLink) return <WiFi />;

          return (
            <>
              {loading && (
                <div className="absolute inset-0 z-10 bg-black bg-opacity-60 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white border-opacity-70"></div>
                </div>
              )}
              <webview
                ref={webviewRef}
                className="w-full h-full"
                src="http://121.184.63.113:3000/"
              />
            </>
          );
        })()}
      </div>
    </div>
  );
}

export default App;
