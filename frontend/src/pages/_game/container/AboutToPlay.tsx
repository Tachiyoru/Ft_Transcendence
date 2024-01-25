import { useLocation, useParams } from "react-router-dom";
import MainLayout from "../../../components/nav/MainLayout"
import { FaUser } from "react-icons/fa6";
import OhOh from "../../../components/popin/OhOh";
import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../../socket/socket";

interface Game {
	gameId: number;
	player1: string;
}

const AboutToPlay = () => {
	const location = useLocation();
	const currentPage = location.pathname;
	const { gameSocket } = useParams();
	const socket = useContext(WebSocketContext);
	const [game, setGame] = useState<Game>();

	useEffect(() => {
		try {
			socket.emit("gamestart", {gameSocket: gameSocket})
			socket.on("gamestart", (game) => {
				console.log(game);
				setGame(game);
			});
		} catch (error) {
			console.error('Erreur lors de la récupération des données:', error);
		}
	}, [socket]);

	return (
		<MainLayout currentPage={currentPage}>
		{game &&
		<div className="flex-1 bg-violet-black h-[80vh] flex justify-center items-center text-lilac">
			<div className="grid grid-cols-1 gap-20 text-center">
			<div>
				<h3 className="font-audiowide text-2xl mb-12">Get ready</h3>
				<div className="flex flex-row justify-center gap-14 mb-32">
					<div className='flex flex-col items-center'>
						<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
							<FaUser className="w-[30px] h-[30px] text-lilac" />
						</div>
						<p className='text-base mt-2'>{game.player1}</p>
					</div>
					<div className='flex flex-col items-center'>
						<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
							<FaUser className="w-[30px] h-[30px] text-lilac" />
						</div>
						<p className='text-base mt-2'>{game.player1}</p>
					</div>
				</div>
			</div>
			<p className="font-audiowide text-purple">Your game is <br/> about to begin</p>
			</div>
		</div>
		}
		</MainLayout>
	)
}

export default AboutToPlay