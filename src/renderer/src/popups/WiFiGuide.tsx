import CloseIcon from '../assets/images/svg/close.svg';
import DongleIMG from '../assets/images/dongle.png';
import WiFiIMG_EN from '../assets/images/wifi_en.png';
import WiFiIMG_KO from '../assets/images/wifi_ko.png';
import WiFiPWD_EN from '../assets/images/wifi_pwd_en.png';
import WiFiPWD_KO from '../assets/images/wifi_pwd_ko.png';

import AdapterImg_EN from '../assets/images/adapter_en.png';
import AdapterImg_KO from '../assets/images/adapter_ko.png';
import RunImg_EN from '../assets/images/run_en.png';
import RunImg_KO from '../assets/images/run_ko.png';

import { useTranslation } from 'react-i18next';

const WiFiGuide = ({ onClose }) => {

   const { t, i18n } = useTranslation();
   const currentLang = i18n.language;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col bg-white w-[500px] h-auto  px-6 pb-5 rounded-3xl shadow-lg relative">
        <div className='flex justify-between items-center pb-5 pt-6 '>
          <div className="text-2xl font-bold  text-black">{t('wifi_guide')}</div>
          <img className='text-black cursor-pointer' src={CloseIcon} onClick={onClose}></img>
        </div>
        <div className='flex flex-col h-[500px] gap-8 overflow-auto mt-5 scrollbar-thin'>
          <p className="text-[16px] text-[#444444] font-medium">
            <p dangerouslySetInnerHTML={{ __html: t('step_1') }} />
          </p>
          <img src={DongleIMG} alt="Wi-Fi Icon" className="w-[300px]  mx-auto mb-4  " />
          <p className="text-[16px] text-[#444444] font-medium">
            <p dangerouslySetInnerHTML={{ __html: t('step_2') }} />
          </p>        
          <img src={currentLang === 'ko' ? RunImg_KO : RunImg_EN} onClick={window.api.openNcpa} alt="Wi-Fi Icon" className="w-[320px]  mx-auto mb-4  rounded-lg hover:cursor-pointer hover:scale-105 duration-300 hover:shadow-lg" />
          <p className="text-[16px] text-[#444444] font-medium">
            <p dangerouslySetInnerHTML={{ __html: t('step_3') }} />
          </p>        
          <img src={currentLang === 'ko' ? AdapterImg_KO : AdapterImg_EN} alt="Wi-Fi Icon" className="w-[320px]  mx-auto mb-4 " />
          <p className="text-[16px] text-[#444444] font-medium">
            <p dangerouslySetInnerHTML={{ __html: t('step_4') }} />
          </p>
          <img src={currentLang === 'ko' ? WiFiIMG_KO : WiFiIMG_EN} onClick={window.api.openWifiTray} alt="Wi-Fi Icon" className="w-[300px]  mx-auto mb-4 hover:cursor-pointer hover:scale-105 duration-300 hover:shadow-lg" />
          <p className="text-[16px] text-[#444444] font-medium">
            <p dangerouslySetInnerHTML={{ __html: t('step_5') }} />
          </p>
          <img src={currentLang === 'ko' ? WiFiPWD_KO : WiFiPWD_EN} alt="Wi-Fi Icon" className="w-[300px]  mx-auto mb-4" />
        </div>
        <div className='flex text-black justify-center items-center  pt-5 hover:cursor-pointer'>
          <div className='flex w-full h-[50px] bg-[#6A2A4F] rounded-xl justify-center items-center cursor-pointer text-white font-semibold text-[16px]' onClick={onClose}>
            <span>{t('close')}</span>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default WiFiGuide;
