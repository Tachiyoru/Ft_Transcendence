import { useEffect, useRef, useState } from 'react';
import { IoSettingsSharp } from 'react-icons/io5';
import ChannelSettings from './ChannelSettings';
import { FaArrowRightFromBracket } from 'react-icons/fa6';

const ChannelOptions = () => {
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
	<div className="relative inline-block">
		<button
		className="pr-4 flex flex-row text-lilac items-center"
		onClick={togglePopin}
		>
		<IoSettingsSharp className="w-4 h-5 mr-2 relative" />
		</button>
		{popinOpen && (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black bg-opacity-50"></div>
			<div ref={cardRef} className="absolute top-24 right-24 mt-8 z-50">
			<div className="bg-dark-violet rounded-lg pl-2 pr-4 py-3">
				<ChannelSettings/>
				<div className='flex items-center justify-center mt-1'>
				<button
					className="flex flex-row text-lilac items-center pl-2"
				>
					<FaArrowRightFromBracket className="w-3 h-3 relative mr-2" />
					<p>Quit Channel</p>
				</button>
				</div>
			</div>
			</div>
		</div>
		)}
	</div>
	);
	};

export default ChannelOptions;

