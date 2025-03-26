import CloseIcon from '../assets/images/svg/close.svg';

const WiFiGuide = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] p-6 rounded-lg shadow-lg relative">
        <div className='flex justify-between items-center'>
          <div className="text-xl font-bold  text-black">Wi-Fi 연결 가이드</div>
          <img className='text-black cursor-pointer' src={CloseIcon} onClick={onClose}></img>
        </div>
        <p className="text-sm text-gray-700">
          1. 설정에서 Wi-Fi를 켜세요. <br />
          2. 사용할 네트워크를 선택하고 비밀번호를 입력하세요. <br />
          3. 연결이 완료되면 확인 메시지가 나타납니다.
        </p>
      </div>
    </div>
  );
};

export default WiFiGuide;
