import CloseIcon from '../assets/images/svg/close.svg';
import DongleIMG from '../assets/images/dongle.png';
import WiFiIMG from '../assets/images/wifi.png';
import WiFiPWD from '../assets/images/wifi_pwd.png';
import AdapterImg from '../assets/images/adapter.png';
import RunImg from '../assets/images/run.png';

const WiFiGuide = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col bg-white w-[500px] h-auto  px-6 pb-5 rounded-3xl shadow-lg relative">
        <div className='flex justify-between items-center pb-5 pt-6 '>
          <div className="text-2xl font-bold  text-black">Wi-Fi 연결 가이드</div>
          <img className='text-black cursor-pointer' src={CloseIcon} onClick={onClose}></img>
        </div>
        <div className='flex flex-col h-[500px] gap-8 overflow-auto mt-5 scrollbar-thin'>
          <p className="text-[16px] text-[#444444] font-medium">
            1. PC의 USB 포트에 Wi-Fi 동글을 연결합니다. <br />
          </p>
          <img src={DongleIMG} alt="Wi-Fi Icon" className="w-[300px]  mx-auto mb-4  " />
          <p className="text-[16px] text-[#444444] font-medium">
            2. 아래 이미지를 클릭하여 어댑터 설정 창을 엽니다. <br />
          </p>        
          <img src={RunImg} onClick={window.api.openNcpa} alt="Wi-Fi Icon" className="w-[320px]  mx-auto mb-4  rounded-lg hover:cursor-pointer hover:scale-105 duration-300 hover:shadow-lg" />
          <p className="text-[16px] text-[#444444] font-medium">
            3. TP-Link Wireless USB Adapter에 해당하는 Wi-Fi 인터페이스 이름(예: Wi-Fi 2)을 확인합니다. 
          </p>        
          <img src={AdapterImg} alt="Wi-Fi Icon" className="w-[320px]  mx-auto mb-4 " />
          <p className="text-[16px] text-[#444444] font-medium">
            4. 아래 이미지를 클릭하여 Wi-Fi 연결 창을 엽니다.
            {/* <span className='font-bold text-[14px] text-[#676767]' > 보안 키는 'jajucha123'입니다.</span> */}
          </p>
          <img src={WiFiIMG} onClick={window.api.openWifiTray} alt="Wi-Fi Icon" className="w-[300px]  mx-auto mb-4 hover:cursor-pointer hover:scale-105 duration-300 hover:shadow-lg" />
          <p className="text-[16px] text-[#444444] font-medium">
            5. 사용하려는 Wi-Fi 인터페이스와 네트워크를 선택한 후, 보안 키로 **jajucha123**을 입력하세요.
          </p>
          <img src={WiFiPWD}  alt="Wi-Fi Icon" className="w-[300px]  mx-auto mb-4" />
        </div>
        <div className='flex text-black justify-center items-center  pt-5 hover:cursor-pointer'>
          <div className='flex w-full h-[50px] bg-[#6A2A4F] rounded-xl justify-center items-center cursor-pointer text-white font-semibold text-[16px]' onClick={onClose}>
            닫기
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default WiFiGuide;
