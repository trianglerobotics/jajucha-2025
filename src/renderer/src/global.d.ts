export {};

declare global {
  interface Window {
    api: {
      getWifiInfo: () => Promise<any>;
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
    };
  }
}
