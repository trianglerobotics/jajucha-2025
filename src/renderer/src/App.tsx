import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import WiFi from './components/WiFi'; // WiFi 컴포넌트는 이제 사용되지 않지만, 혹시 몰라 import는 남겨둡니다.
import MainBgImage from './assets/images/main-bg.jpg';
import i18n from '../i18n';

function App(): JSX.Element {
  const [wifiInfo, setWifiInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const webviewRef = useRef<any | null>(null);
  const retryCountRef = useRef(0);
  const isReloadingRef = useRef(false);

  const MAX_RETRIES = 10;
  const BASE_URL = 'http://121.184.63.113:3000/';

  // ✅ Wi-Fi 정보 주기적으로 가져오기 (이 기능은 Header 표시 등을 위해 유지)
  useEffect(() => {
    const fetchWifiInfo = async () => {
      try {
        const data = await window.api.getWifiInfo();
        setWifiInfo(data);
      } catch (error) {
        console.error('❌ Error fetching Wi-Fi info:', error);
      }
    };
    fetchWifiInfo();

    // const interval = setInterval(fetchWifiInfo, 1000);
    // return () => clearInterval(interval);
  }, []);

  // ✅ Webview 수동 리로드
  const reloadWebview = () => {
    const webview = webviewRef.current as any;
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
  
  // ✅ [제거됨] 현재 TP-Link의 SSID 추출 로직
  // const currentSSID = ...

  // ✅ webview에 언어 반영 (in-page 우선, 실패 시 ?lang= 폴백)
  const applyLangToWebview = async (code: string) => {
    const wv = webviewRef.current as any;
    if (!wv) return;

    try {
      const ok = await wv.executeJavaScript(`
        (function(){
          try {
            localStorage.setItem('i18nextLng', '${code}');
            if (window.i18n && typeof window.i18n.changeLanguage === 'function') {
              window.i18n.changeLanguage('${code}');
              return true;
            } else {
              return false;
            }
          } catch (e) { return false; }
        })();
      `);

      if (!ok) {
        const current = wv.getURL?.() || '${BASE_URL}';
        const url = new URL(current, '${BASE_URL}');
        url.searchParams.set('lang', '${code}');
        wv.loadURL(url.toString());
      }
    } catch {
      const url = new URL('${BASE_URL}');
      url.searchParams.set('lang', '${code}');
      wv.loadURL(url.toString());
    }
  };

  // ✅ 부모 i18n 변경을 webview에 브릿지
  useEffect(() => {
    const handler = (lng: string) => {
      applyLangToWebview(lng);
    };
    i18n.on('languageChanged', handler);
    return () => i18n.off('languageChanged', handler);
  }, []);

  // ✅ webview 이벤트 등록 및 로딩 처리
  // 💡 [수정] currentSSID 의존성을 제거하여 Wi-Fi 상태와 무관하게 항상 실행되도록 변경
  useEffect(() => {
    const webview = webviewRef.current as any;
    if (!webview) return;

    const baseWidth = 1920;
    const currentWidth = window.innerWidth;
    const zoomFactor = currentWidth / baseWidth;

    const onDomReady = () => {
      applyLangToWebview(i18n.language);
    };

    const onDidFinishLoad = () => {
      console.log('✅ Webview finished loading');
      webview.setZoomFactor?.(zoomFactor);
      setLoading(false);
      retryCountRef.current = 0;
      isReloadingRef.current = false;
      applyLangToWebview(i18n.language);
    };

    const onDidFailLoad = (e: any) => {
      console.warn('❌ Webview failed to load:', e?.errorDescription);

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

    webview.addEventListener('dom-ready', onDomReady);
    webview.addEventListener('did-finish-load', onDidFinishLoad);
    webview.addEventListener('did-fail-load', onDidFailLoad);

    return () => {
      webview.removeEventListener('dom-ready', onDomReady);
      webview.removeEventListener('did-finish-load', onDidFinishLoad);
      webview.removeEventListener('did-fail-load', onDidFailLoad);
    };
  }, []); // 💡 의존성 배열에서 currentSSID 제거

  // ✅ 창 크기 조정 시 줌 비율 설정
  useEffect(() => {
    const handleResize = () => {
      const webview = webviewRef.current as any;
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

  // ✅ [제거됨] WiFi 끊겼을 때 로딩 스피너 유지 로직
  // useEffect(() => { ... }, [wifiInfo]);

  // ✅ 초기 진입도 현재 언어를 붙여 로드
  const initialSrc = `${BASE_URL}?lang=${encodeURIComponent(i18n.language || 'en')}`;

  return (
    <div
      className="h-screen flex flex-col text-white min-w-[960px]"
      style={{ backgroundImage: `url(${MainBgImage})`, backgroundSize: 'cover' }}
    >
      <div className="h-[60px] shrink-0">
        <Header wifiInfo={wifiInfo} reloadWebview={reloadWebview} />
      </div>

      <div className="flex-grow h-0 relative">
        {/* 💡 [수정] Wi-Fi 연결 상태와 관계없이 항상 webview를 렌더링하도록 변경 */}
        <>
          {loading && (
            <div className="absolute inset-0 z-10 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white border-opacity-70" />
            </div>
          )}
          <webview
            ref={webviewRef}
            className="w-full h-full"
            src={initialSrc}
          />
        </>
      </div>
    </div>
  );
}

export default App;