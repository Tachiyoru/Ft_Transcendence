import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa6';
import { MdSettings } from 'react-icons/md';

const ChannelSettings = () => {
	const [popinOpen, setPopinOpen] = useState(true);
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
				<div ref={cardRef} className="bg-filter text-lilac rounded-lg p-8 w-2/3 h-80 relative">
					<span className="absolute text-lilac top-6 right-6 cursor-pointer" onClick={togglePopin}>
					X
					</span>
					<h3>Victory</h3>
					<p>+10 xp</p>
					<div className='flex flex-row'>
						<FaUser size={10}/>
						<p>10 - 14</p>
						<FaUser size={10}/>
					</div>
				</div>
			</div>
		)}
		</div>
	);
};

export default ChannelSettings;
