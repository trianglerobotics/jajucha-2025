import { useState,useEffect,useRef  } from 'react';
import Veluna from '../assets/images/altinoai_logo.svg';
import RemoteImage from '../assets/images/svg/remote.svg';
import DriveImage from '../assets/images/svg/drive.svg';
import WindowMinimizeImage from '../assets/images/svg/window-minimize.svg';
import WindowMaximizeImage from '../assets/images/svg/window-maximize.svg';
import WindowCloseImage from '../assets/images/svg/window-close.svg';

import batt_10 from '../assets/images/svg/batt_10.svg';
import batt_20 from '../assets/images/svg/batt_20.svg';
import batt_30 from '../assets/images/svg/batt_30.svg';
import batt_40 from '../assets/images/svg/batt_40.svg';
import batt_50 from '../assets/images/svg/batt_50.svg';
import batt_60 from '../assets/images/svg/batt_60.svg';
import batt_70 from '../assets/images/svg/batt_70.svg';
import batt_80 from '../assets/images/svg/batt_80.svg';
import batt_90 from '../assets/images/svg/batt_90.svg';
import batt_100 from '../assets/images/svg/batt_100.svg';

const batteryImages = {
  batt_100,
  batt_90,
  batt_80,
  batt_70,
  batt_60,
  batt_50,
  batt_40,
  batt_30,
  batt_20,
  batt_10,
};

const Header = ({ wifiInfo,reloadWebview }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [diskUsage, setDiskUsage] = useState(null);
  const [batteryInfo, setBatteryInfo] = useState(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    async function fetchWifiInfo() {
      try {
        const data = await window.api.getDiskUsage();
        setDiskUsage(data);
      } catch (error) {
        console.error('Error fetching Wi-Fi info:', error);
      }
    }
    fetchWifiInfo(); // 초기 로딩 시에도 한번 호출
    
    const interval = setInterval(fetchWifiInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchBatteryInfo() {
      try {
        const data = await window.api.getBatteryInfo();
        setBatteryInfo(data);
      } catch (error) {
        console.error('Error fetching battery info:', error);
      }
    }
    fetchBatteryInfo(); // 초기 로딩 시에도 한번 호출

    const interval = setInterval(fetchBatteryInfo, 5000);
    return () => clearInterval(interval);
  
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedElement = event.target as Node;
      const isInsideMenu = menuRef.current?.contains(clickedElement);
      const isToggleButton = (clickedElement as HTMLElement)?.closest('[data-menu-toggle]');
  
      if (!isInsideMenu && !isToggleButton) {
        setIsMenuOpen(false);
      }
    };
  
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
  
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey); // 👈 ESC 이벤트 추가
      window.addEventListener('blur', () => setIsMenuOpen(false));
    }
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey); // 👈 정리도 해줘야 함
      window.removeEventListener('blur', () => setIsMenuOpen(false));
    };
  }, [isMenuOpen]);
  
  
  
  
  return (
    <>
      <div
        className="flex items-center justify-between h-[60px] bg-[rgba(0,0,0,0.6)] px-[32px] text-[14px]"
        style={{ WebkitAppRegion: 'drag' }}
      >
        {/* 로고 (클릭 시 메뉴 토글) */}
        <a
          href="#"
          className="hover:opacity-75"
          style={{ WebkitAppRegion: 'no-drag' }}
          data-menu-toggle
          onClick={(e) => {
            e.preventDefault();
            toggleMenu()
          }}
        >
          <img src={Veluna} alt="Logo" className="h-8" />
        </a>

        {/* 오른쪽 정보들 */}
        <div className="flex items-center" style={{ WebkitAppRegion: 'no-drag' }}>
          <div className="flex items-center gap-4">
            {batteryInfo !== null && (
            <div className="flex items-center gap-2">
              <img src={batteryImages[`batt_${batteryInfo}`]} className="h-6" />
              <span>{batteryInfo}%</span>
            </div>
            )}
            {diskUsage !== null && (
            <div className="flex items-center gap-2">
              <img src={DriveImage} alt="Drive" className="h-6" />
              <span>{diskUsage}%</span>
            </div>
            )}
            <button className="flex items-center py-[3px] pl-[3px] pr-4 rounded-full bg-[rgba(132,132,132,0.208)]">
              <div className="border-circle bg-brand-primary rounded-full p-1 mr-2">
                <img src={RemoteImage} alt="Remote" className="h-6" />
              </div>
              <span className="flex px-2">
                {(() => {
                  const tpLink = wifiInfo?.find((item) =>
                    item.interfaceName.startsWith('TP-Link') &&
                    item.ssid?.includes('altinoai')
                  );
                  return tpLink ? `${tpLink.ssid}` : '연결없음';
                })()}
              </span>
            </button>
          </div>

          {/* 창 조작 버튼 */}
          <div className="flex items-center gap-4 ml-[40px]" style={{ WebkitAppRegion: 'no-drag' }}>
            <button>
              <img
                src={WindowMinimizeImage}
                alt="Minimize"
                className="h-6 hover:opacity-75"
                onClick={() => window.api.minimizeWindow()}
              />
            </button>
            <button>
              <img
                src={WindowMaximizeImage}
                alt="Maximize"
                className="h-6 hover:opacity-75"
                onClick={() => window.api.maximizeWindow()}
              />
            </button>
            <button>
              <img
                src={WindowCloseImage}
                alt="Close"
                className="h-6 hover:opacity-75"
                onClick={() => window.api.closeWindow()}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ▼ 드롭다운 메뉴 ▼ */}
      {isMenuOpen && (
        <div ref={menuRef}
          className="absolute flex justify-start top-[60px] left-[10px] w-[350px] bg-[#FFFFFF] text-black opacity-95 px-4 py-4 z-50 rounded-xl shadow-lg transition-all duration-300"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          <ul className="flex flex-col space-y-1 text-xl px-1 w-full">
            <li>
              {/* refresh */}
              <a
                onClick={(e) => {
                  e.preventDefault();
                  reloadWebview(true);
                }}
                className="w-full p-2 hover:bg-purple-400 hover:cursor-pointer rounded-lg flex items-center gap-2 transition-colors duration-200"
              >
                🔄 <span>Refresh</span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
