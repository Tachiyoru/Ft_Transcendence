import { useEffect, useRef, useState } from 'react';
import { FaStar, FaUser } from 'react-icons/fa6';
import { MdWallet } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

const Defeat = ({game}) => {
	const [popinOpen, setPopinOpen] = useState(true);
	const cardRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	const togglePopin = () => {
		setPopinOpen(!popinOpen);
	};


	useEffect(() => {
	const handleClickOutside = (event: MouseEvent) => {
		if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
			setPopinOpen(false);
			navigate('/');
		}
	};

	document.addEventListener("mousedown", handleClickOutside);

	return () => {
		document.removeEventListener("mousedown", handleClickOutside);
	};
	}, []);

	return (
	<div className="flex items-center justify-center">
		{popinOpen && game && (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
				<div ref={cardRef} className="bg-filter text-lilac rounded-lg p-8 w-auto h-[50vh] relative">
					<Link to={'/'}>
						<span className="absolute text-lilac top-6 right-6 cursor-pointer" onClick={togglePopin}>
						&#10005;
						</span>
					</Link>
					<div className='flex flex-col items-center'>
						<div className='flex flex-row h-10 gap-x-2 text-purple opacity-40'>
							<FaStar className="w-6 h-6"/>
							<FaStar className="w-8 h-8" style={{ marginTop: '-12px' }}/>
							<FaStar className="w-6 h-6"/>
						</div>
						<h3 className='font-audiowide text-2xl font-outline-1 text-lilac'>Defeat</h3>
						<p className='font-audiowide mt-2'>+10 xp</p>
						<div className='flex flex-row gap-x-4 items-center mt-10'>
						{game.victory === 1 ? (
								<div className='flex flex-col items-center'>
								{game.player1.playerProfile.avatar ? (
									<img
									src={game.player1.playerProfile.avatar}
									className="h-[80px] w-[80px] object-cover rounded-full text-lilac border-lilac mt-2"
									/>
								) : (
									<div className="w-[80px] h-[80px] bg-purple rounded-full grid justify-items-center items-center mt-2">
										<FaUser className="w-[30px] h-[30px] text-lilac" />
									</div>
								)}
								<p>{game.player1.playerProfile?.username}</p>
								</div>
							) : (
								<div className='flex flex-col items-center'>
								{game.player2.playerProfile.avatar ? (
									<img
									src={game.player2.playerProfile.avatar}
									className="h-[80px] w-[80px] object-cover rounded-full text-lilac border-lilac mt-2"
									/>
								) : (
									<div className="w-[80px] h-[80px] bg-purple rounded-full grid justify-items-center items-center mt-2">
										<FaUser className="w-[30px] h-[30px] text-lilac" />
									</div>
								)}
								<p>{game.player2.playerProfile?.username}</p>
								</div>
								)}
							<p className='font-kanit font-bold text-3xl opacity-40'>{Math.max(...game.pScore)}</p>
							<p className='font-kanit font-bold text-3xl opacity-40'>-</p>
							<p className='font-kanit font-bold text-3xl'>{Math.min(...game.pScore)}</p>
							{game.victory === 2 ? (
								<div className='flex flex-col items-center'>
								{game.player1.playerProfile.avatar ? (
									<img
									src={game.player1.playerProfile.avatar}
									className="h-[80px] w-[80px] object-cover rounded-full text-lilac border-lilac mt-2"
									/>
								) : (
									<div className="w-[80px] h-[80px] bg-purple rounded-full grid justify-items-center items-center mt-2">
										<FaUser className="w-[30px] h-[30px] text-lilac" />
									</div>
								)}
								<p>{game.player1.playerProfile?.username}</p>
								</div>
							) : (
								<div className='flex flex-col items-center'>
								{game.player2.playerProfile.avatar ? (
									<img
									src={game.player2.playerProfile.avatar}
									className="h-[80px] w-[80px] object-cover rounded-full text-lilac border-lilac mt-2"
									/>
								) : (
									<div className="w-[80px] h-[80px] bg-purple rounded-full grid justify-items-center items-center mt-2">
										<FaUser className="w-[30px] h-[30px] text-lilac" />
									</div>
								)}
								<p>{game.player2.playerProfile?.username}</p>
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

export default Defeat;
