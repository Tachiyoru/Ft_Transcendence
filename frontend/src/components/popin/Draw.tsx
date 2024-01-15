import { useEffect, useRef, useState } from 'react';
import { FaStar, FaUser } from 'react-icons/fa6';
import { MdWallet } from 'react-icons/md';

const Draw = () => {
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
				<div ref={cardRef} className="bg-filter text-lilac rounded-lg p-8 w-auto h-[50vh] relative">
					<span className="absolute text-lilac top-6 right-6 cursor-pointer" onClick={togglePopin}>
					&#10005;
					</span>
					<div className='flex flex-col items-center'>
						<div className='flex flex-row h-10 gap-x-2'>
							<FaStar className="w-6 h-6 text-fushia"/>
							<FaStar className="w-8 h-8 text-purple opacity-40" style={{ marginTop: '-12px' }}/>
							<FaStar className="w-6 h-6 text-fushia"/>
						</div>
						<h3 className='font-audiowide text-2xl font-outline-1 text-lilac'>Draw</h3>
						<p className='font-audiowide mt-2'>+10 xp</p>
						<div className='flex flex-row gap-x-4 items-center mt-10'>
							<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
								<FaUser className="w-[30px] h-[30px] text-lilac" />
							</div>
							{numberOfPlayers === 4 && (
							<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
								<FaUser className="w-[30px] h-[30px] text-lilac" />
							</div>
							)}
							<p className='font-kanit font-bold text-3xl'>10</p>
							<p className='font-kanit font-bold text-3xl opacity-40'>-</p>
							<p className='font-kanit font-bold text-3xl'>14</p>
							<div className="w-[80px] h-[80px] mt-2 bg-lilac rounded-full grid justify-items-center items-center">
								<FaUser className="w-[30px] h-[30px] text-purple" />
							</div>
							{numberOfPlayers === 4 && (
							<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
								<FaUser className="w-[30px] h-[30px] text-lilac" />
							</div>
							)}
						</div>
					</div>
				</div>
			</div>
		)}
		</div>
	);
};

export default Draw;
