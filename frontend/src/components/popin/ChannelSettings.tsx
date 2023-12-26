import { useEffect, useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa6';
import { MdSettings } from 'react-icons/md';

const ChannelSettings = () => {
  const [popinOpen, setPopinOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const togglePopin = () => {
    setPopinOpen(!popinOpen);
  };

  useEffect(() => {
	const handleClickOutside = (event: MouseEvent) => {
		if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
			setPopinOpen(false);
		}
	};

	document.addEventListener("mousedown", handleClickOutside);

	return () => {
		document.removeEventListener("mousedown", handleClickOutside);
	};
	}, []);

  return (
    <div className="flex items-center justify-center">
      <button className="pr-4 flex flex-row text-lilac items-center" onClick={togglePopin}>
        <MdSettings className="w-4 h-5 mr-2" />
		Settings
      </button>
      {popinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div ref={cardRef} className="bg-dark-violet text-lilac rounded-lg p-8 w-2/3 h-1/2 relative">
            <span className="absolute text-lilac top-6 right-6 cursor-pointer" onClick={togglePopin}>
              X
            </span>
            <h2 className='text-center text-base text-lilac'>Channel parameters</h2>

			<div className='mt-6'>
				<h3 className='pl-1 mb-4'>Owner</h3>
				<div className="w-[45px] h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center mr-4">
					<FaUser className="w-3 h-3 text-lilac"/>
				</div>
			</div>

			<div className='mt-6'>
				<h3 className='pl-1 mb-2'>Administrators</h3>
				<div className='flex flex-col w-[45px] items-center'>
					<div className="w-[45px] h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
						<FaUser className="w-3 h-3 text-lilac"/>
					</div>
					<p className='pt-2'>Name</p>
				</div>
			</div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelSettings;

