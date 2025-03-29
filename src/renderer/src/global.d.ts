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
