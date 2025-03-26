import { useState,useEffect,useRef  } from 'react';
import LogoImage from '../assets/images/svg/logo.svg';
import BatteryImage from '../assets/images/svg/battery.svg';
import RemoteImage from '../assets/images/svg/remote.svg';
import DriveImage from '../assets/images/svg/drive.svg';
import WindowMinimizeImage from '../assets/images/svg/window-minimize.svg';
import WindowMaximizeImage from '../assets/images/svg/window-maximize.svg';
import WindowCloseImage from '../assets/images/svg/window-close.svg';

const Header = ({ wifiInfo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // 메뉴 영역 참조용

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target)) {
  //       setIsMenuOpen(false);
  //     }
  //   };

  //   if (isMenuOpen) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   } else {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [isMenuOpen]);

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
          onClick={(e) => {
            e.preventDefault();
            toggleMenu();
          }}
        >
          <img src={LogoImage} alt="Logo" className="h-8" />
        </a>

        {/* 오른쪽 정보들 */}
        <div className="flex items-center" style={{ WebkitAppRegion: 'no-drag' }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={BatteryImage} alt="Battery" className="h-6" />
              <span>75%</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={DriveImage} alt="Drive" className="h-6" />
              <span>34%</span>
            </div>
            <button className="flex items-center py-[3px] pl-[3px] pr-4 rounded-full bg-[rgba(132,132,132,0.208)]">
              <div className="border-circle bg-brand-primary rounded-full p-1 mr-2">
                <img src={RemoteImage} alt="Remote" className="h-6" />
              </div>
              <span className="flex px-2">
                {(() => {
                  const tpLink = wifiInfo?.find((item) =>
                    item.interfaceName.startsWith('TP-Link')
                  );
                  return tpLink ? `${tpLink.ssid}` : 'Disconnected';
                })()}
              </span>
            </button>
          </div>

          {/* 창 조작 버튼 */}
          <div className="flex items-center gap-4 ml-[40px]">
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
              <a
                href="#"
                className="w-full p-2 hover:bg-purple-400 rounded-lg flex items-center gap-2 transition-colors duration-200"
              >
                ⚙️   <span>  Settings</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="w-full p-2 hover:bg-purple-400 rounded-lg flex items-center gap-2 transition-colors duration-200"
              >
                🔌 <span>About</span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
