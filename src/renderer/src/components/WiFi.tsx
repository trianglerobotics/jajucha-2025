import GuideIcon from '../assets/images/svg/guide.svg';
import DisCon from '../assets/images/svg/discon.svg';
import WiFiGuide from '../popups/WiFiGuide';

import { useState } from 'react';

const WiFi = () => {

  const [showGuide, setShowGuide] = useState(false);
  return (
    <div className="flex flex-col mx-auto py-[124px] px-6 max-w-[95%]">
      {/* Header */}
      <div className="mb-[32px]">
        <div className="flex items-center justify-between">
          <h1 className="text-[40px] leading-none font-bold">Wi-Fi 연결</h1>
          <div onClick={() => setShowGuide(true)} className='flex items-center bg-[#AA5FDE] hover:bg-[#c483f3] transition-all duration-200 cursor-pointer px-4 py-3 rounded-[10px]'>
            <img src={GuideIcon} alt="Wi-Fi Icon" className="w-[16px] h-[16px] mr-[7px]" />
            <h1 className="text-[14px] leading-none font-semibold ">Wi-Fi 연결 가이드</h1>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-6 h-[calc(100vh-380px)] min-h-[300px]">
        <img src={DisCon} alt="Wi-Fi Icon" className="w-[206px] h-[172px] mr-[7px]" />
      </div>

      {showGuide && <WiFiGuide onClose={() => setShowGuide(false)} />}
    </div>
  );
}

export default WiFi;
