export {};

declare global {
  interface Window {
    api: {
      getWifiInfo: () => Promise<any>;
      getDiskUsage: () => Promise<any>;
      getBatteryInfo: () => Promise<any>;
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
    };
  }
}

import 'react';

declare module 'react' {
  interface CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag'; // ← 요거 추가!
    // 다른 커스텀 스타일도 여기에 추가 가능
  }
}