import { useLocation, useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../components/nav/MainLayout"
import { FaUser } from "react-icons/fa6";
import OhOh from "../../../components/popin/OhOh";
import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../../socket/socket";
import axios from "../../../axios/api";
import Dashboard from "../../_root/Dashboard";

interface Game {
	gameId: number;
	goalsToWin: number;
	player1: {
		playerProfile: {
			username: string;
			avatar: string;
			id: number;
		}
	};
	player2: {
		playerProfile: {
			username: string;
			avatar: string;
			id: number;
		}
	}
}

interface Users {
	username: string;
	avatar: string;
	id: number;
	status: string;
}

const AboutToPlay = () => {
	const location = useLocation();
	const currentPage = location.pathname;
	const { gameSocket } = useParams();
	const socket = useContext(WebSocketContext);
	const [game, setGame] = useState<Game | null>();
	const [isReset, setIsReset]  = useState<boolean>(false);
	const navigate = useNavigate();
	const [userData, setUserData] = useState<Users>();
	const [goalCount, setGoalCount] = useState<number>(3);

	useEffect(() => {
		const fetchData = async () => {
		try {
			const userDataResponse = await axios.get('/users/me');
			setUserData(userDataResponse.data);
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
		};
		fetchData();
	}, [isReset]);

	useEffect(() => {
		try {
			socket.emit("findGame", {gameSocket: gameSocket});
			socket.on("findGame", (game) =>
			{
				// console.log("game.goalsToWin set to : ", game.goalsToWin);
				setGame(game);
				console.log(game);
			});
			socket.emit("verifyGame", {gameSocket: gameSocket, userId: userData?.id})
			socket.on("verifyGame", (boolean) => {
			if (!boolean)
				setGame(null);
			});
		} catch (error) {
			console.error('Erreur lors de la récupération des données:', error);
		}
	}, [socket, userData, goalCount]);

	const handleStartGame = () => {
		if (game)
		{
			navigate(`/test/${gameSocket}`);
		}
	};

	const handleGoalCountChange = (e: any) =>
	{
		let goalCountNumber = parseInt(e.target.value);
		if (goalCountNumber === 0 || Number.isNaN(goalCountNumber))
				goalCountNumber = 0;
		setGoalCount(goalCountNumber);
	}

	useEffect(()  =>
	{
		setGoalCount(goalCount);
		socket.emit("setGoalsToWin", { gameSocket: gameSocket, goalsToWin: goalCount });
		socket.on("goalsToWin", (game: Game) =>
		{
			setGame(game);
		});
	}, [goalCount]);

	return (
		<MainLayout currentPage={currentPage}>
		<div className="flex-1 bg-violet-black h-[80vh] flex justify-center items-center text-lilac">
		{game ? (
			<div className="grid grid-cols-1 gap-20 text-center cursor-default">
			<div>
				<h3 className="font-audiowide text-2xl mb-12">Get ready</h3>
				<div className="flex flex-row justify-center gap-14 mb-32">
					<div className='flex flex-col items-center'>
						{game.player1.playerProfile.avatar ?
							(
								<div>
								<img
									src={game.player1.playerProfile.avatar}
									className="h-[80px] w-[80px] object-cover rounded-full text-lilac border-lilac mt-2"
								/>
								</div>	
							) : (
								<div className="w-[80px] h-[80px] bg-purple rounded-full grid justify-items-center items-center mt-2">
								<FaUser className="w-[30px] h-[30px] text-lilac" />
								</div>
							)
						}
						<p className='text-base mt-2'>{game.player1.playerProfile.username}</p>
					</div>
					<div className='flex flex-col items-center'>
						{game.player2.playerProfile.avatar ?
							(
								<div>
								<img
									src={game.player2.playerProfile.avatar}
									className="h-[80px] w-[80px] object-cover rounded-full text-lilac border-lilac mt-2"
								/>
								</div>	
							) : (
								<div className="w-[80px] h-[80px] bg-purple rounded-full grid justify-items-center items-center mt-2">
								<FaUser className="w-[30px] h-[30px] text-lilac" />
								</div>
							)
						}
						<p className='text-base mt-2'>{game.player2.playerProfile.username}</p>
					</div>
					</div>
					<p className="font-audiowide text-1xl mb-1">First to [{game.goalsToWin}] goals wins
					</p>
					{userData && userData.id === game.player1.playerProfile.id && (
					<input
						type="text"
						placeholder="select number of goals to win"
						value={goalCount}
						onChange={(e) => handleGoalCountChange(e)}
						className="bg-dark-violet text-lilac px-2 rounded py-0.5 focus:outline-none"
					/>
					)}
				<p
					className="font-audiowide text-purple underline hover:text-red-orange cursor-pointer mt-8"
					onClick={handleStartGame}
					>
					Start Game
				</p>
				</div>
			</div>
		) : <OhOh error={true}/> }
		</div>
		</MainLayout>
	)
}

export default AboutToPlay