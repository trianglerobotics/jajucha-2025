import { exec } from 'child_process'; // Keep for other potential uses
import sudo from 'sudo-prompt'; // Import the new library

/**
 * @description Currently connected Wi-Fi's detailed information.
 */
type WifiInfo = {
  ssid: string;
  bssid: string;
  rssi: number;
  channel: number;
  txRate: number;
};

/**
 * Gets current Wi-Fi info in an Electron app on macOS.
 * This will trigger a native OS password prompt for the user.
 * Returns null if the user cancels, or if not connected.
 * @returns Promise<WifiInfo | null>
 */
export function getAllConnectedWifiInfo(): Promise<WifiInfo | null> {
  return new Promise((resolve, reject) => {
    const command = 'wdutil info';
    const options = {
      name: 'Your Electron App Name',
    };

    sudo.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        if (error.message.includes('User did not grant permission')) {
          console.log('User cancelled the password prompt.');
          return resolve(null);
        }
        return reject(error);
      }
      
      const output = stdout.toString();
      const lines = output.trim().split('\n');
      const wifiData: { [key: string]: string } = {};

      console.log('Raw command output:', output);
      
      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          wifiData[key] = value;
        }
      }

      if (!wifiData['SSID']) {
        return resolve(null);
      }

      // --- 🚨 여기를 수정했습니다! ---
      // 'TX RATE' -> 'Tx Rate' (T만 대문자, 공백 포함)
      // 'CHANNEL' -> 'Channel' (C만 대문자)
      const result: WifiInfo = {
        ssid: wifiData['SSID'],
        bssid: wifiData['BSSID'],
        rssi: parseInt(wifiData['RSSI'], 10),
        channel: parseInt(wifiData['Channel'], 10), // 'Channel'로 변경
        txRate: parseFloat(wifiData['Tx Rate']),     // 'Tx Rate'로 변경
      };

      resolve(result);
    });
  });
}