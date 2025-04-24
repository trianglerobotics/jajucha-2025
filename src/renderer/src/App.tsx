import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import WiFi from './components/WiFi';
import MainBgImage from './assets/images/main-bg.jpg';

function App(): JSX.Element {
  const [wifiInfo, setWifiInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const webviewRef = useRef<HTMLWebViewElement | null>(null);
  const retryCountRef = useRef(0);
  const isReloadingRef = useRef(false);

  const MAX_RETRIES = 10;

  // ✅ Wi-Fi 정보 주기적으로 가져오기
  useEffect(() => {
    const fetchWifiInfo = async () => {
      try {
        const data = await window.api.getWifiInfo();
        setWifiInfo(data);
      } catch (error) {
        console.error('❌ Error fetching Wi-Fi info:', error);
      }
    };

    const interval = setInterval(fetchWifiInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Webview 수동 리로드
  const reloadWebview = () => {
    const webview = webviewRef.current;
    if (!webview) {
      console.warn('❌ Webview not mounted yet.');
      return;
    }
    if (isReloadingRef.current) {
      console.warn('⏳ Already reloading. Skipping.');
      return;
    }

    console.log('🔁 Manual Webview reload requested');
    isReloadingRef.current = true;
    setLoading(true);
    webview.reload();
  };

  // ✅ 현재 TP-Link의 SSID 추출
  const currentSSID = wifiInfo?.find(
    item =>
      item.interfaceName?.startsWith('TP-Link') &&
      item.ssid?.includes('jajucha')
  )?.ssid;

  // ✅ webview 이벤트 등록 및 로딩 처리
  useEffect(() => {
    const webview = webviewRef.current;
    if (!currentSSID || !webview) return;

    const baseWidth = 1920;
    const currentWidth = window.innerWidth;
    const zoomFactor = currentWidth / baseWidth;

    const onDidFinishLoad = () => {
      console.log('✅ Webview finished loading');
      webview.setZoomFactor?.(zoomFactor);
      setLoading(false);
      retryCountRef.current = 0;
      isReloadingRef.current = false;
    };

    const onDidFailLoad = (e: any) => {
      console.warn('❌ Webview failed to load:', e?.errorDescription);
      console.log('🧪 isReloadingRef:', isReloadingRef.current);
      console.log('🧪 retryCountRef:', retryCountRef.current);
      console.log('🧪 isMainFrame:', e?.isMainFrame);

      if (!e?.isMainFrame) {
        console.log('ℹ️ Ignoring subresource load failure');
        return;
      }

      if (isReloadingRef.current) {
        console.log('🚫 Ignoring fail during manual reload');
        isReloadingRef.current = false;
        setLoading(false);
        return;
      }

      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        console.log(`🔁 Retrying to load webview (${retryCountRef.current})...`);
        setTimeout(() => webview.reload(), 500);
      } else {
        console.log('🚫 Max retries reached. Giving up.');
        setLoading(false);
      }
    };

    webview.addEventListener('did-finish-load', onDidFinishLoad);
    webview.addEventListener('did-fail-load', onDidFailLoad);

    return () => {
      webview.removeEventListener('did-finish-load', onDidFinishLoad);
      webview.removeEventListener('did-fail-load', onDidFailLoad);
    };
  }, [currentSSID]);

  // ✅ 창 크기 조정 시 줌 비율 설정
  useEffect(() => {
    const handleResize = () => {
      const webview = webviewRef.current;
      if (!webview) return;

      const baseWidth = 1920;
      const currentWidth = window.innerWidth;
      const zoomFactor = currentWidth / baseWidth;
      console.log(`🔍 ZoomFactor updated to ${zoomFactor}`);
      webview.setZoomFactor?.(zoomFactor);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ WiFi 끊겼을 때 로딩 스피너 유지
  useEffect(() => {
    const isTPLinkConnected = wifiInfo?.some(
      item =>
        item.interfaceName?.startsWith('TP-Link') &&
        item.ssid?.includes('jajucha')
    );
    if (!isTPLinkConnected) {
      setLoading(true);
    }
  }, [wifiInfo]);

  return (
    <div
      className="h-screen flex flex-col text-white min-w-[960px]"
      style={{ backgroundImage: `url(${MainBgImage})`, backgroundSize: 'cover' }}
    >
      <div className="h-[60px] shrink-0">
        <Header wifiInfo={wifiInfo} reloadWebview={reloadWebview} />
      </div>

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
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white border-opacity-70" />
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
