import CloseIcon from '../assets/images/svg/close.svg';
import DongleIMG from '../assets/images/dongle.png';
import WiFiIMG from '../assets/images/wifi.png';
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
            1. PC USB 포트에 Wi-Fi dongle을 연결합니다. <br />
          </p>
          <img src={DongleIMG} alt="Wi-Fi Icon" className="w-[300px]  mx-auto mb-4  " />
          <p className="text-[16px] text-[#444444] font-medium">
            2. Win + R 키를 눌러 실행창 열기,<span className='font-semibold'> ncpa.cpl </span> 입력 후 확인 버튼 클릭 <br />
          </p>        
          <img src={RunImg} alt="Wi-Fi Icon" className="w-[300px]  mx-auto mb-4  rounded-lg" />
          <p className="text-[16px] text-[#444444] font-medium">
            3. TP-Link Wireless USB Adapter 에 해당하는 Wi-Fi 번호를 확인 합니다 <span className='font-base text-[14px] text-[#9e9e9e]' > 예시) Wi-Fi 2</span> 
          </p>        
          <img src={AdapterImg} alt="Wi-Fi Icon" className="w-[300px]  mx-auto mb-4 rounded-lg" />
          <p className="text-[16px] text-[#444444] font-medium">
            4. Wi-Fi 인터페이스와 네트워크를 선택하고 보안 키를 입력 하세요
            <span className='font-base text-[14px] text-[#9e9e9e]' > 보안 키는 'jajucha123'입니다.</span>
          </p>
          <img src={WiFiIMG} alt="Wi-Fi Icon" className="w-[300px]  mx-auto mb-4  shadow-xl rounded-lg" />
        </div>
        <div className='flex text-black justify-center items-center  pt-5'>
          <div className='flex w-full h-[50px] bg-[#6A2A4F] rounded-xl justify-center items-center cursor-pointer text-white font-semibold text-[16px]' onClick={onClose}>
            닫기
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default WiFiGuide;
