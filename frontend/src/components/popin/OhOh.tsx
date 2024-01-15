import { useEffect, useRef, useState } from 'react';
import { FaArrowRightFromBracket, FaStar, FaUser } from 'react-icons/fa6';
import { MdWallet } from 'react-icons/md';

const OhOh = () => {
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

	const numberOfPlayers = 4;

	return (
	<div className="flex items-center justify-center">
		<button className="pr-4 flex flex-row text-lilac items-center" onClick={togglePopin}>
			<MdWallet className="w-4 h-5 mr-2" />
			Draw
		</button>
		{popinOpen && (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
				<div ref={cardRef} className="bg-filter text-lilac rounded-lg p-8 w-auto h-auto relative">
					<span className="absolute text-lilac top-6 right-6 cursor-pointer" onClick={togglePopin}>
					&#10005;
					</span>
					<div className='flex flex-col items-center text-xs'>
						<h3 className='font-audiowide text-2xl font-outline-1 text-dark-violet'>Oh oh...</h3>
						<p className='mt-2'>An error has occured</p>
						<div className='flex flex-row items-center gap-x-2 mt-6'>
							<FaArrowRightFromBracket className="transform rotate-180" size={10}/>
							<p className='underline'>Go back to homapage</p>
						</div>
					</div>
				</div>
			</div>
		)}
		</div>
	);
};

export default OhOh;
