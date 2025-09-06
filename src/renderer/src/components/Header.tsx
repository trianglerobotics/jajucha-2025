import { useState, useEffect, useRef } from 'react';
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

import refresh from '../assets/images/svg/refresh.svg';
import language from '../assets/images/svg/language.svg';

import { useTranslation } from 'react-i18next';

type Props = {
  wifiInfo: any;
  reloadWebview: (force?: boolean) => void;
};

const batteryImages: Record<string, string> = {
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

const Header: React.FC<Props> = ({ wifiInfo, reloadWebview }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [diskUsage, setDiskUsage] = useState<number | null>(null);
  const [batteryInfo, setBatteryInfo] = useState<number | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);

  // ✅ ref 타입 지정 (never 문제 해결)
  const menuRef = useRef<HTMLDivElement | null>(null);
  const langRef = useRef<HTMLDivElement | null>(null);

  const { t, i18n } = useTranslation();

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  useEffect(() => {
    async function fetchDiskUsage() {
      try {
        const data = await window.api.getDiskUsage();
        setDiskUsage(data);
      } catch (error) {
        console.error('Error fetching disk usage:', error);
      }
    }
    fetchDiskUsage();
    const interval = setInterval(fetchDiskUsage, 5000);
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
    fetchBatteryInfo();
    const interval = setInterval(fetchBatteryInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ 바깥 클릭/ESC 닫기 (타입 안전)
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const inMenu = !!menuRef.current && menuRef.current.contains(target);
      const inLang = !!langRef.current && langRef.current.contains(target);
      const isToggle = (target as Element)?.closest?.('[data-menu-toggle]');

      if (!inMenu && !inLang && !isToggle) {
        setIsMenuOpen(false);
        setIsLangOpen(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsLangOpen(false);
      }
    };

    const onBlur = () => setIsMenuOpen(false);

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
      
      window.addEventListener('blur', onBlur);
    }

    
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscKey);
        window.removeEventListener('blur', onBlur);
      };
  }, [isMenuOpen]);

  // ✅ 현재 연결된 TP-Link SSID
  const currentTpLink = wifiInfo?.find(
    (item: any) =>
      item?.interfaceName?.startsWith?.('TP-Link') &&
      item?.ssid?.includes?.('altinoai')
  );

  return (
    <>
      <div
        className="flex items-center justify-between h-[60px] bg-[rgba(0,0,0,0.6)] px-[32px] text-[14px]"
        style={{ WebkitAppRegion: 'drag' }}
      >
        <a
          href="#"
          className="hover:opacity-75"
          style={{ WebkitAppRegion: 'no-drag' }}
          data-menu-toggle
          onClick={(e) => {
            e.preventDefault();
            toggleMenu();
          }}
        >
          <img src={Veluna} alt="Logo" className="h-8" />
        </a>

        <div className="flex items-center" style={{ WebkitAppRegion: 'no-drag' }}>
          <div className="flex items-center gap-4">
            {batteryInfo !== null && (
              <div className="flex items-center gap-2">
                <img src={batteryImages[`batt_${batteryInfo}`]} className="h-6" alt="Battery" />
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
                {currentTpLink ? currentTpLink.ssid : t('no_connection')}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4 ml-[40px]" style={{ WebkitAppRegion: 'no-drag' }}>
            <button onClick={() => window.api.minimizeWindow()}>
              <img src={WindowMinimizeImage} alt="Minimize" className="h-6 hover:opacity-75" />
            </button>
            <button onClick={() => window.api.maximizeWindow()}>
              <img src={WindowMaximizeImage} alt="Maximize" className="h-6 hover:opacity-75" />
            </button>
            <button onClick={() => window.api.closeWindow()}>
              <img src={WindowCloseImage} alt="Close" className="h-6 hover:opacity-75" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute flex justify-start top-[60px] left-[10px] w-[300px] bg-[#FFFFFF] text-black opacity-95 px-4 py-4 z-50 rounded-xl shadow-lg transition-all duration-300"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          <ul className="flex flex-col space-y-1 text-xl px-1 w-full">
            <li>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  reloadWebview(true);
                }}
                className="w-full p-2 hover:bg-purple-400 active:bg-purple-500 hover:cursor-pointer rounded-lg flex items-center gap-2 transition-colors duration-200"
              >
                <img src={refresh} alt="Refresh" className="h-6 mr-1" /> <h1>{t('refresh')}</h1>
              </a>

              {/* 언어 메뉴 */}
              <div
                className="relative pr-4" // ← hover 영역 확장
                onMouseEnter={() => setIsLangOpen(true)}
                onMouseLeave={() => setIsLangOpen(false)}
                ref={langRef}
              >
                <a className="w-full p-2 hover:bg-purple-400 active:bg-purple-500 hover:cursor-pointer rounded-lg flex items-center gap-2 transition-colors duration-200">
                  <img src={language} alt="Language" className="h-6 mr-1" /> <h1>{t('language')}</h1>
                </a>

                {isLangOpen && (
                  <>
                    {/* hover 브릿지: 버튼과 메뉴 사이의 빈 공간에서도 hover 유지 */}
                    <div className="absolute left-full top-0 w-2 h-full bg-transparent" />

                    <div className="absolute left-full top-0 w-[120px] bg-white border rounded-md shadow-lg z-50"
                         onMouseEnter={() => setIsLangOpen(true)}
                         onMouseLeave={() => setIsLangOpen(false)}
                    >
                      <ul className="flex flex-col text-sm text-gray-800">
                        <li
                          onClick={() => {
                            i18n.changeLanguage('en');
                            setIsLangOpen(false);
                          }}
                          className={`px-3 py-2 cursor-pointer hover:bg-purple-100 rounded-md ${
                            i18n.language === 'en' ? 'bg-purple-200 font-semibold' : ''
                          }`}
                        >
                          English
                        </li>
                        <li
                          onClick={() => {
                            i18n.changeLanguage('ko');
                            setIsLangOpen(false);
                          }}
                          className={`px-3 py-2 cursor-pointer hover:bg-purple-100 rounded-md ${
                            i18n.language === 'ko' ? 'bg-purple-200 font-semibold' : ''
                          }`}
                        >
                          한국어
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
