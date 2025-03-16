import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { getAllConnectedWifiInfo } from './wifi';

let mainWindow;
let splash;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false, // 처음에는 숨김
    autoHideMenuBar: true,
    frame: false, // 창 테두리 제거 (필요하면 true로 변경)
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    setTimeout(() => {
      splash.close(); // 스플래시 스크린 닫기
      mainWindow.show();
    }, 2000); // 2초 대기
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
    frame: false, // 창 테두리 제거 (필요하면 true로 변경)
    alwaysOnTop: true,
    transparent: false, // 흰색 배경이므로 투명 비활성화
    autoHideMenuBar: true, // 💡 메뉴바 숨기기
    resizable: false, // 💡 창 크기 고정
    show: false, // 💡 처음에는 숨김
    webPreferences: {
      scrollbar: false, // ⚠️ Electron 자체 옵션에는 없음, CSS에서 숨겨야 함
    }
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
});

// Handle IPC requests from the renderer process
ipcMain.handle('get-wifi-info', async () => {
  try {
    console.log('Getting Wi-Fi info...');
    return getAllConnectedWifiInfo();
  } catch (error) {
    console.error('Error getting Wi-Fi info:', error);
    return { error: 'Failed to retrieve Wi-Fi information' };
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});