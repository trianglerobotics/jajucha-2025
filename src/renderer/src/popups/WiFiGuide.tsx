import CloseIcon from '../assets/images/svg/close.svg';
import DongleIMG from '../assets/images/dongle.png';
import WiFiIMG from '../assets/images/wifi.png';
import AdapterImg from '../assets/images/adapter.png';
import RunImg from '../assets/images/run.png';

const WiFiGuide = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] h-auto  px-4 pb-5 rounded-3xl shadow-lg relative">
        <div className='flex justify-between items-center pb-5 pt-6 '>
          <div className="text-2xl font-bold  text-black">Wi-Fi 연결 가이드</div>
          <img className='text-black cursor-pointer' src={CloseIcon} onClick={onClose}></img>
        </div>
        <div className='flex flex-col h-[600px] gap-8 overflow-auto mt-2'>
        <p className="text-[16px] text-[#444444]">
          1. PC USB 포트에 Wi-Fi dongle을 연결합니다. <br />
        </p>
        <img src={DongleIMG} alt="Wi-Fi Icon" className="w-[300px]  mx-auto mb-4" />
        <p className="text-[16px] text-[#444444]">
          2. Win + R 키를 눌러 실행창 열기 , ncpa.cpl 입력 후 확인 버튼 클릭 <br />
        </p>        
        <img src={RunImg} alt="Wi-Fi Icon" className="w-[300px]  mx-auto mb-4" />
        <p className="text-[16px] text-[#444444]">
          3. TP-Link Wireless USB Adapter 에 해당하는 Wi-Fi 번호를 확인 합니다 <span className='font-bold text-xs ' > 예시) Wi-Fi 2</span> 
        </p>        
        <img src={AdapterImg} alt="Wi-Fi Icon" className="w-[300px]  mx-auto mb-4" />
        <p className="text-[16px] text-[#444444]">
          4. Wi-Fi 인터페이스와 네트워크를 선택하고 보안 키를 입력 하세요
          <span className='font-bold text-xs ml-3 ' >보안 키는 'jajucha123'입니다.</span>
        </p>
        <img src={WiFiIMG} alt="Wi-Fi Icon" className="w-[300px]  mx-auto mb-4" />
        </div>
      </div>
    </div>
  );
};

export default WiFiGuide;
