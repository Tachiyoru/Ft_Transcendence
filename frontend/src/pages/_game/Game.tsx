import { Navigate, useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../components/nav/MainLayout"
import { IoIosArrowForward } from "react-icons/io";
import { useContext, useState } from "react";
import { FaUser } from "react-icons/fa6";
import { RiTriangleFill } from "react-icons/ri";
import { useRef, useEffect } from "react";
import Winner from "../../components/popin/Victory";
import Defeat from "../../components/popin/Defeat";
import Draw from "../../components/popin/Draw";
import { WebSocketContext } from "../../socket/socket";
import axiosInstance from "../../axios/api";
import UserNameField from "../_auth/fields/UserNameField";
import { set, useFormState } from "react-hook-form";

interface gameData
{
	gameInviteId: number;
	hostId: number;
	invitedId: number;
}

const Game = () => {
	const location = useLocation();
	const currentPage = location.pathname;
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [showBackIndex, setShowBackIndex] = useState<number | null>(null);
	const cardsRef = useRef<HTMLDivElement>(null);
	const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
	const socket = useContext(WebSocketContext);
	const navigate = useNavigate();
	const [friendsList, setFriendsList] = useState<{ username: string; id: number; }[]>([]);
	const [userData, setUserData] = useState<{ username: string; id: number; } | null>(null);
	const [invitedFriend, setInvitedFriend] = useState<{ username: string; id: number; } | null>(null);
	const [gameData, setGameData] = useState<gameData>();

	const [gameOption1, setGameOption1] = useState(true);
    const [gameOption2, setGameOption2] = useState(false);

    const handleGameOption1Change = () => {
        setGameOption1(true);
        setGameOption2(false);
    };

    const handleGameOption2Change = () => {
        setGameOption1(false);
        setGameOption2(true);
    };

    const toggleCard = (index: number) => {
        if (showBackIndex === index) {
            setShowBackIndex(null);
        } else {
            setShowBackIndex(index);
        }
		};

	useEffect(() =>
	{
		
		// need to change to only friend list, not all users

    const fetchAllUsersData = async () => {
      try {
				const response = await axiosInstance.get<{ username: string; id: number; }[]>("/users/all");
        setFriendsList(response.data);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
		fetchAllUsersData();
		
		const fetchUserData = async () =>
		{
			try {
				const response = await axiosInstance.get<{ username: string; id: number }>("/users/me");
				setUserData(response.data);

			} catch (error) {
				console.error("Error fetching user list:", error);
			}
		}
		fetchUserData();
  }, []);

	const setClickedIndex = (index: number, user: {username: string, id: number}) => {
		let updatedIndexes = [...selectedIndexes];

		const indexExists = updatedIndexes.indexOf(index);
		setInvitedFriend(user);
		// envoyer une notification à l'utilisateur sélectionné
		const sendNotification = async () =>
		{
			await axiosInstance.post(`/notification/add/${user.id}`, { fromUser: userData?.username , type: 2, fromUserId: userData?.id});
			socket.emit("all-update")
		}
		sendNotification();

		const createInviteGame = async () =>
		{
			socket.emit("createInviteGame", user.id);
			socket.on("gameInviteData", (game) =>
			{
				if (game)
					setGameData(game);
			});
			// console.log(game);
			// if (game)
			// 	setGameData(game);
		}

		createInviteGame();

		if (indexExists === -1) {
			updatedIndexes.push(index);
		} else {
			updatedIndexes = updatedIndexes.filter((i) => i !== index);
		}

		setSelectedIndexes(updatedIndexes);
	};

	const connectServ = () =>	{
		socket.emit("start");
		setSelectedIndexes([-1]);
	}

	useEffect(() => {
		socket.emit("notInGame");
	},[]);

	useEffect(() => {
		socket.on("CreatedGame", (game) => {
			try {
			console.log("New Game:", game);
			navigate(`/gamestart/${game.gameSocket}`)

		} catch (error) {
			console.error("Error", error);
		}
		});
	}, [socket]);

	const [showSecondDiv, setShowSecondDiv] = useState(
		localStorage.getItem('showSecondDiv') === 'true'
		);

		useEffect(() => {
		if (selectedIndexes.length === 1) {
			const timer = setTimeout(() => {
			setShowSecondDiv(true);
			localStorage.setItem('showSecondDiv', 'true');
			}, 10000);
		
			return () => clearTimeout(timer);
		} else {
			setShowSecondDiv(false);
			localStorage.removeItem('showSecondDiv');
		}
	}, [selectedIndexes]);

	const handleCrossClick = async () => {
	setShowSecondDiv(false);
	setSelectedIndexes([]);
	if (gameData && gameData.gameInviteId)
	{
		socket.emit("removeGameInvite", gameData.gameInviteId);
		// rajouter popup "Game/invitation not found/expired"; 
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	}
	socket.emit("gotDisconnected");
	localStorage.removeItem('showSecondDiv');
	// socket.emit("getAllGameInvites");
	};

	return (
	<MainLayout currentPage={currentPage}>
		<div>
			{/*TITLE*/}
			<h1 className="text-xl font-outline-2 text-white px-4">Game</h1>
			<p className="text-sm text-lilac mt-3 w-4/5 px-4">
			A match lasts 3 minutes. You can choose to invite your friend(s) to play with you or play with someone random
			(some delay may occur because you can’t play by yourself).
			</p>

			{/*GAME*/}
			<div>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  cursor-default sm:px-2 py-10 md:px-5">
					
					{/*GAME 1*/}
					<div className={`h-[50vh] md:h-[50vh] lg:h-[62vh] p-4 rounded-lg flex flex-col bg-filter bg-opacity-75 ${showBackIndex === 0 ? 'hidden' : ''}`}>
						<div className="relative h-4/5">
							<img src="src/game.png" alt='img' className="w-full h-full object-cover"/>
							<div className="absolute inset-0 flex items-center justify-center">
								<p className="text-3xl md:text-4xl text-center font-audiowide text-lilac mix-blend-difference">1 vs 1</p>
							</div>   
						</div>
						<div className="px-2 py-4">
							<div className="flex flex-col justify-end space-y-2 px-2 py-2 rounded-md bg-purple">
								<button className="flex flex-row justify-between items-center hover" onClick={() => toggleCard(0)}>
									<div className="text-xs text-lilac">Invite friends</div>
									<IoIosArrowForward className="w-2 h-2 text-lilac" />
								</button>
								<div className="border-t border-lilac"></div>
								<div className="flex flex-row justify-between items-center cursor-pointer">
									<div onClick={() => { connectServ(); toggleCard(0); }} className="text-xs text-lilac">Random player</div>
									<IoIosArrowForward className="w-2 h-2 text-lilac" />
								</div>
							</div>
						</div>
						</div>
					<div
					ref={cardsRef}
					className={`h-[50vh] md:h-[50vh] lg:h-[62vh] p-3 rounded-md bg-violet-black border-container grid grid-rows-[2fr,auto] ${showBackIndex === 0 ? '' : 'hidden'}`}
						>
					{selectedIndexes.length === 0 ? (
						<div className="relative">
						{/*LIST*/}
						<div className="h-2/3 bg-filter my-4">
							<h3 className='absolute top-0 text-lilac text-[0.9rem] md:text-[1.2rem] lg:text-[1.2rem] font-audiowide pl-2'>choose a player</h3>
							<div className="py-4">
							{friendsList.map((user, index) => (
									<div key={index}>
										<div
											className="flex flex-row justify-content items-center px-2 py-1 cursor-pointer"
											onMouseEnter={() => setHoveredIndex(index)}
											onMouseLeave={() => setHoveredIndex(null)}
										onClick={() => setClickedIndex(index, user)}
										>
											<div className="mr-1">
											{index === hoveredIndex ? (
												<RiTriangleFill className="w-[8px] h-[8px] text-lilac transform rotate-90" />
												) : ( <div className="w-[8px] h-[8px]"></div> )}
											</div>
											<div className="w-[20px] h-[20px] bg-purple rounded-full grid justify-items-center items-center">
												<FaUser className="w-[8px] h-[8px] text-lilac" />
											</div>
										<p className={`text-sm font-regular ml-2 ${index === hoveredIndex ? 'text-lilac' : 'text-lilac opacity-60'}`}>{user.username}</p>
										</div>
									
								</div>
							))}
							<p className="absolute bottom-28 md:bottom-28 lg:bottom-36 text-lilac pl-2 font-audiowide">0/1</p>
							</div>
							</div>
								<div className="flex flex-col justify-end mb-6">
									<div className="flex flex-row items-center my-2 m-auto ">
									<div className="border-t w-12 border-lilac"></div>
									<span className="mx-4 text-sm text-lilac">OR</span>
									<div className="border-t w-12 border-lilac"></div>
									</div>
									<div className="flex flex-row justify-between items-center bg-purple p-2 mx-4 rounded-md cursor-pointer">
									<div onClick={() => { connectServ()}} className="text-xs text-lilac">Random player</div>
									<IoIosArrowForward className="w-2 h-2 text-lilac"/>
									</div>
							</div>
						</div>
					) : (
						<div className="relative text-lilac">
							{!showSecondDiv && selectedIndexes[0] !== -1? (
							<>
							<div className="pb-6">
								<div onClick={handleCrossClick}className="cross-icon cursor-pointer absolute right-0">
									&#x2715;
								</div>
							</div>
							<div className="flex justify-center h-5/6">
								<h3 className="absolute font-audiowide text-xl">Waiting for...</h3>
								<div className="w-full h-5/6 bg-filter my-4 p-4 flex flex-col justify-center items-center">
									<div className="element-to-animate rounded-full mt-10" style={{ width: '80px', height: '80px' }}>
										<FaUser className="absolute transform translate-x-1/2  translate-y-1/2 text-lilac z-50" style={{ fontSize: '40px' }} />
									</div>
									<p>{invitedFriend?.username}</p>
									<div className="mt-auto mb-4 w-full h-2 bg-violet-black relative">
										<div className="h-full bg-fushia" style={{ width: '50%' }} />
									</div>
								</div>
							</div>
							<p className="absolute bottom-14 text-lilac pl-2 font-audiowide">0/1</p>
							</>
							) : selectedIndexes[0] === -1 ? (
								<>
								<div className="pb-6">
									<div onClick={handleCrossClick}className="cross-icon cursor-pointer absolute right-0">
										&#x2715;
									</div>
								</div>
								<div className="flex justify-center h-5/6">
									<h3 className="absolute font-audiowide text-xl">Waiting for...</h3>
									<div className="w-full h-5/6 bg-filter my-4 p-4 flex flex-col justify-center items-center">
										<div className="element-to-animate rounded-full" style={{ width: '80px', height: '80px' }}>
											<FaUser className="absolute transform translate-x-1/2  translate-y-1/2 text-lilac z-50 " style={{ fontSize: '40px' }} />
										</div>
									</div>
								</div>
								<p className="absolute bottom-14 text-lilac pl-2 font-audiowide">0/1</p>
								</>
							) : (
								<>
								<div className="pb-6">
									<div onClick={handleCrossClick}className="cross-icon cursor-pointer absolute right-0">
										&#x2715;
									</div>
								</div>
								<div className="flex justify-center h-5/6">
									<h3 className="absolute font-audiowide text-xl z-50">Unavailable</h3>
									<div className="w-full h-5/6 bg-filter opacity-50 my-4 p-4 flex flex-col justify-center items-center">
										<div className="bg-purple rounded-full mt-10" style={{ width: '80px', height: '80px' }}>
											<FaUser className="absolute transform translate-x-1/2  translate-y-1/2 text-lilac z-50 " style={{ fontSize: '40px' }} />
										</div>
										<p>{invitedFriend?.username}</p>
										<div className="mt-auto mb-4 w-full h-2 bg-violet-black relative">
											<div className="h-full" style={{ width: '50%' }} />
										</div>
									</div>
								</div>
								<p className="absolute bottom-14 text-lilac pl-2 font-audiowide">0/1</p>
								</>
							)}
							</div>
					)}
					</div>

					{/*GAME 2*/}
					<div className={`sm:col-span-1 md:col-span-2 lg:col-span-3 h-[50vh] md:h-[50vh] lg:h-[62vh] p-4 rounded-lg bg-filter bg-opacity-75 ml-4 ${showBackIndex === 1 ? 'hidden' : ''}`}>
						{/*MOBILE*/}
						<div className="text-lilac text-sm block md:hidden">
							<p>You can choose between two themes for your game.
								The scores will be on your screen with the timer.<br/><br/>
							</p>
							<p>Change theme</p>
								<div className="block">
									<div className="mt-2">
										<label className="inline-flex items-center space-x-2">
												<input
													type="checkbox"
													className="w-5 h-5 rounded-full text-dark-violet bg-transparent border-lilac border-2 focus:ring-transparent focus:ring-opacity-0"
													checked={gameOption1}
													onChange={handleGameOption1Change}
												/>
												<input
													type="checkbox"
													className="w-5 h-5 rounded-full text-dark-violet bg-transparent border-lilac border-2 focus:ring-transparent focus:ring-opacity-0"
													checked={gameOption2}
													onChange={handleGameOption2Change}
												/>
										</label>
									</div>
								</div>
						</div>
						{/*TABLET DESKTOP*/}
						<div className="grid grid-cols-2 space-x-6 p-4">
							<div className="h-4/5 space-y-6 md:block hidden">
								<img src='src/gamevue1.png' className="w-full h-[40%] object-cover" alt="Game Screenshot 1" />
								<img src='src/gamevue2.png' className="w-full h-[40%] object-cover" alt="Game Screenshot 2" />
							</div>
							<div className="text-sm text-lilac md:block hidden">
								<div>
									<p>With your mouse you can control the paddle of 
										your side and move it up or down. 
										In order to score points, the other player has to 
										miss the ball. A game will stop after 3 minutes 
										and the winner will be the higher score.<br/><br/>

										You can choose between two themes for your game.
										The scores will be on your screen with the timer.<br/><br/>
									</p>
								</div>
								<p>Change theme</p>
								<div className="block">
									<div className="mt-2">
										<label className="inline-flex items-center space-x-2">
												<input
													type="checkbox"
													className="w-5 h-5 rounded-full text-dark-violet bg-transparent border-lilac border-2 focus:ring-transparent focus:ring-opacity-0"
													checked={gameOption1}
													onChange={handleGameOption1Change}
												/>
												<input
													type="checkbox"
													className="w-5 h-5 rounded-full text-dark-violet bg-transparent border-lilac border-2 focus:ring-transparent focus:ring-opacity-0"
													checked={gameOption2}
													onChange={handleGameOption2Change}
												/>
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
					
				</div>
			</div>


		</div>
	</MainLayout>
	)
}

export default Game