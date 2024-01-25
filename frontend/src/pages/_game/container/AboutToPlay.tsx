import { useLocation, useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../components/nav/MainLayout"
import { FaUser } from "react-icons/fa6";
import OhOh from "../../../components/popin/OhOh";
import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../../socket/socket";

interface Game {
	gameId: number;
	player1: string;
	player1User : {
		username: string;
		avatar: string;
	};
	player2User : {
		username: string;
		avatar: string;
	}
}

const AboutToPlay = () => {
	const location = useLocation();
	const currentPage = location.pathname;
	let { gameSocket } = useParams();
	const socket = useContext(WebSocketContext);
	const [game, setGame] = useState<Game | null>();
	const [isReset, setIsReset]  = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		try {
			socket.emit("gamestart", {gameSocket: gameSocket})
			socket.on("gamestart", (game) => {
				setGame(game);
			});
			socket.on("GameReset", (error) => {
				console.log(error)
			});
		} catch (error) {
			console.error('Erreur lors de la récupération des données:', error);
		}
	}, [socket]);

	return (
		<MainLayout currentPage={currentPage}>
		<div className="flex-1 bg-violet-black h-[80vh] flex justify-center items-center text-lilac">
		{game ? (
			<div className="grid grid-cols-1 gap-20 text-center">
			<div>
				<h3 className="font-audiowide text-2xl mb-12">Get ready</h3>
				<div className="flex flex-row justify-center gap-14 mb-32">
					<div className='flex flex-col items-center'>
						{game.player1User.avatar ?
							(
								<div>
								<img
									src={game.player1User.avatar}
									className="h-[80px] w-[80px] object-cover rounded-full text-lilac border-lilac mt-2"
								/>
								</div>	
							) : (
								<div className="w-[80px] h-[80px] bg-purple rounded-full grid justify-items-center items-center mt-2">
								<FaUser className="w-[30px] h-[30px] text-lilac" />
								</div>
							)
						}
						<p className='text-base mt-2'>{game.player1User.username}</p>
					</div>
					<div className='flex flex-col items-center'>
						{game.player2User.avatar ?
							(
								<div>
								<img
									src={game.player2User.avatar}
									className="h-[80px] w-[80px] object-cover rounded-full text-lilac border-lilac mt-2"
								/>
								</div>	
							) : (
								<div className="w-[80px] h-[80px] bg-purple rounded-full grid justify-items-center items-center mt-2">
								<FaUser className="w-[30px] h-[30px] text-lilac" />
								</div>
							)
						}
						<p className='text-base mt-2'>{game.player2User.username}</p>
					</div>
				</div>
			</div>
			<p className="font-audiowide text-purple">Your game is <br/> about to begin</p>
			</div>
		) : <OhOh error={true}/> }
		</div>
		</MainLayout>
	)
}

export default AboutToPlay