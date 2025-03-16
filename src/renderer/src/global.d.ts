export {};

declare global {
  interface Window {
    api: {
      getWifiInfo: () => Promise<any>;
    };
  }
}
