import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { getAllConnectedWifiInfo } from './wifi';
import axios from 'axios';
import path from 'path';
import { exec } from 'child_process';

let mainWindow;
let splash;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1200,
    minHeight: 700,
    icon: path.join(__dirname, '../../public/altinoai.ico'),
    show: false, // 처음에는 숨김
    autoHideMenuBar: true,
    frame: false, // 창 테두리 제거 (필요하면 true로 변경)
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true,
    }
  });

  // mainWindow.webContents.openDevTools({ mode: 'right' });


  mainWindow.on("ready-to-show", () => {
    setTimeout(() => {
      if (splash && !splash.isDestroyed()) {
        splash.close();
      }
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.show();
      }
    }, 2000);
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

function createSplashScreen() {
  splash = new BrowserWindow({
    width: 960,  // 💡 가로 크기 1200px
    height: 540, // 💡 세로 크기 800px
    icon: path.join(__dirname, '../../public/altinoai.ico'),
    frame: false, // 창 테두리 제거 (필요하면 true로 변경)
    alwaysOnTop: true,
    transparent: true, // ✅ 배경 투명하게
    backgroundColor: '#00000000', // ✅ 완전 투명 배경
    autoHideMenuBar: true, // 💡 메뉴바 숨기기
    resizable: false, // 💡 창 크기 고정
    show: false, // 💡 처음에는 숨김
  });

  splash.loadFile(join(app.getAppPath(), 'public/splash.html'));

  // 💡 준비가 완료되면 창을 표시
  splash.once('ready-to-show', () => {
    splash.show();
  });
}


app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createSplashScreen(); // 스플래시 화면 생성
  createWindow(); // 메인 윈도우 생성

    // ✅ CSP 무력화 (fetch 등 외부 요청 허용용)
});


ipcMain.handle('get-disk-usage', async () => {
  const fetchDiskUsage = async () => {
    try {
      const { data } = await axios.get('http://121.184.63.113:4000/api/diskusage', {
        timeout: 5000 // ⏱️ 5초 후 타임아웃
      });
      
      const total = data.total;
      const free = data.free;
      const used = total - free; // 83736748032
      const usedPercentage = Math.round((used / total) * 100); // ≈ 33.57%
      return usedPercentage;

    } catch (error) {
      // console.error('Failed to fetch disk usage:', error);
      return null;
    }
  };

  return fetchDiskUsage(); 
});

ipcMain.handle('get-battery-info', async () => {
  const fetchBatteryInfo = async () => {
    try {
      const motor = await axios.get('http://121.184.63.113:4000/api/motorstatus', {
        timeout: 5000 // ⏱️ 5초 후 타임아웃
      });
      
      const result = Math.floor(
        ((parseFloat(motor.data.storedData.substring(2, 5)) / 10 - 12) / (15.9 - 12)) * 10
      ) * 10;
      if(result < 10) {
        return 10;
      }
      if(result > 100) {
        return 100;
      }
      
      return result;

    } catch (error) {
      // console.error('Failed to fetch battery info:', error);
      return null;
    }
  };

  return fetchBatteryInfo(); 
});



// Handle IPC requests from the renderer process
ipcMain.handle('get-wifi-info', async () => {
  try {
    // console.log('Getting Wi-Fi info...');
    return getAllConnectedWifiInfo();

    
  } catch (error) {
    // console.error('Error getting Wi-Fi info:', error);
    return { error: 'Failed to retrieve Wi-Fi information' };
  }
});

ipcMain.handle('minimize-window', () => {
  mainWindow.minimize();
}
);

ipcMain.handle('maximize-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
}
);

ipcMain.handle('close-window', () => {
  mainWindow.close();
});

ipcMain.handle('open-ncpa', async () => {
  exec('control ncpa.cpl', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);
  });
});

ipcMain.handle('open-tray-wifi', async () => {
  exec('explorer.exe ms-availablenetworks:', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});