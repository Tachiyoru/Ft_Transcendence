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
import { set } from "react-hook-form";

const Game = () => {
	const location = useLocation();
	const currentPage = location.pathname;
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [showBackIndex, setShowBackIndex] = useState<number | null>(null);
	const cardsRef = useRef<HTMLDivElement>(null);
	const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
	const socket = useContext(WebSocketContext);
	const navigate = useNavigate();
	const [friendsList, setFriendsList] = useState<{ username: string; }[]>([]);
	const [userData, setUserData] = useState<{ username: string; id: number } | null>(null);
	const [invitedFriend, setInvitedFriend] = useState<{ username: string; } | null>(null);

	const names = ['Shan', 'Manu', 'Bob'];

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
        const response = await axiosInstance.get<{ username: string }[]>("/users/all");
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
		console.log(user.username, user.id);
		setInvitedFriend(user);
		// envoyer une notification à l'utilisateur sélectionné
		const sendNotification = async () =>
		{
			await axiosInstance.post(`/notification/add/${user.id}`, { fromUser: userData?.username , type: 2, fromUserId: userData?.id});
		}
		sendNotification();

		const createInviteGame = async () =>
		{
			socket.emit("createInviteGame", user.id);
		}

		createInviteGame();

		if (indexExists === -1) {
			updatedIndexes.push(index);
		} else {
			updatedIndexes = updatedIndexes.filter((i) => i !== index);
		}

		setSelectedIndexes(updatedIndexes);
		console.log(selectedIndexes)
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

	const handleCrossClick = () => {
	setShowSecondDiv(false);
	setSelectedIndexes([]);
	socket.emit("gotDisconnected");
	localStorage.removeItem('showSecondDiv');
	};


	return (
	<MainLayout currentPage={currentPage}>
		<div>
			{/*TITLE*/}
			<h1 className="text-xl font-outline-2 text-white px-4">Game</h1>
			<p className="text-sm text-lilac mt-3 w-4/5 px-4">
			A match lasts 3 minutes. You can choose to invite your friend(s) to play with you or play with someone random
			(some delay may occur because you can’t play by yourself) You can also watch someone else’s game.<br/><br/>

			You each have three bonus actions available: freeze, fire and invisibility. 
			They are reachable with keyboards 1, 2, and 3. They have a charging time of 20 seconds each.
			</p>

			{/*GAME*/}
			<div className="mt-12">
				<div className="flex flex-row space-x-4 cursor-default">
					
					{/*GAME 1*/}
					<div className={`flex w-full h-96 p-4 rounded-lg grid grid-rows-[2fr,auto] bg-filter bg-opacity-75 ${showBackIndex === 0 ? 'hidden' : ''}`}>
						<div className="relative">
						<img src="src/game.png" alt='img' className="w-full h-60"/>
							<div className="absolute inset-0 flex items-center justify-center">
								<p className="text-4xl text-center font-audiowide text-lilac mix-blend-difference">1 vs 1</p>
							</div>	
						</div>
						<div className="px-2 pb-4">
						<div className="flex flex-col justify-end space-y-2 px-2 py-2 rounded-md bg-purple">
							<button className="flex flex-row justify-between items-center hover" onClick={() => toggleCard(0)}>
								<div  className="text-xs text-lilac">Invite friends</div>
								<IoIosArrowForward className="w-2 h-2 text-lilac"/>
							</button>
							<div className="border-t border-lilac"></div>
							<div className="flex flex-row justify-between items-center cursor-pointer">
								<div onClick={() => { connectServ(); toggleCard(0); }} className="text-xs text-lilac">Random player</div>
								<IoIosArrowForward className="w-2 h-2 text-lilac"/>
							</div>
						</div>
						</div>
					</div>
					<div
					ref={cardsRef}
					className={`flex h-96 w-full rounded-md bg-violet-black border-container grid grid-rows-[2fr,auto] p-2 ${showBackIndex === 0 ? '' : 'hidden'}`}
						>
					{selectedIndexes.length === 0 ? (
						<div className="relative">
						{/*LIST*/}
						<div className="w-full h-2/3 bg-filter my-4">
							<h3 className='absolute top-0 text-lilac text-xl font-audiowide pl-2'>choose a player</h3>
							<div className="py-4">
							{friendsList.map((user, index) => (
									<div key={index}>
										<div
											className="flex flex-row justify-content items-center px-2 py-1 cursor-pointer"
											onMouseEnter={() => setHoveredIndex(index)}
											onMouseLeave={() => setHoveredIndex(null)}
										onClick={() => setClickedIndex(index, user)}
										>
											<div className="mr-2">
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
							<p className="absolute bottom-24 text-lilac pl-2 font-audiowide">0/1</p>
							</div>
							</div>
								<div className="flex flex-col justify-end mb-6">
									<div className="flex flex-row items-center my-2 m-auto ">
									<div className="border-t w-12 border-lilac"></div>
									<span className="mx-4 text-sm text-lilac">OR</span>
									<div className="border-t w-12 border-lilac"></div>
									</div>
									<div className="flex flex-row justify-between items-center bg-purple p-2 mx-4 rounded-md cursor-pointer">
									<div onClick={() => { connectServ(); toggleCard(0); }} className="text-xs text-lilac">Random player</div>
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
					<div className={`flex w-full h-96 p-4 rounded-lg grid grid-rows-[2fr,auto] bg-filter bg-opacity-75 ${showBackIndex === 1 ? 'hidden' : ''}`}>
						<div className="relative">
						<img src="src/game.png" alt='img' className="w-full h-60"/>
							<div className="absolute inset-0 flex items-center justify-center">
								<p className="text-4xl text-center font-audiowide text-lilac mix-blend-difference">1 vs 1</p>
							</div>	
						</div>
						<div className="px-2 pb-4">
						<div className="flex flex-col justify-end space-y-2 px-2 py-2 rounded-md bg-purple">
							<button className="flex flex-row justify-between items-center hover" onClick={() => toggleCard(1)}>
								<div  className="text-xs text-lilac">Invite friends</div>
								<IoIosArrowForward className="w-2 h-2 text-lilac"/>
							</button>
							<div className="border-t border-lilac"></div>
							<div className="flex flex-row justify-between items-center">
							<div onClick={() => { connectServ(); toggleCard(1); }} className="text-xs text-lilac">Random player</div>
								<IoIosArrowForward className="w-2 h-2 text-lilac"/>
							</div>
						</div>
						</div>
					</div>
					<div
					ref={cardsRef}
					className={`flex h-96 w-full rounded-md bg-violet-black border-container grid grid-rows-[2fr,auto] p-2 ${showBackIndex === 1 ? '' : 'hidden'}`}
						>
					{selectedIndexes.length !== 3 ? (
						<div className="relative">
						{/*LIST*/}
						<div className="w-full h-2/3 bg-filter my-4">
							<h3 className='absolute top-0 text-lilac text-xl font-audiowide pl-2'>choose a player</h3>
							<div className="py-4">
							{names.map((name, index) => (
									<div key={index}>
										<div
											className="flex flex-row justify-content items-center px-2 py-1 cursor-pointer"
											onMouseEnter={() => setHoveredIndex(index)}
											onMouseLeave={() => setHoveredIndex(null)}
											onClick={() => setClickedIndex(index)}
										>
											<div className="mr-2">
											{selectedIndexes.includes(index) || index === hoveredIndex ? (
												<RiTriangleFill className="w-[8px] h-[8px] text-lilac transform rotate-90" />
												) : ( <div className="w-[8px] h-[8px]"></div> )}
											</div>
											<div className="w-[20px] h-[20px] bg-purple rounded-full grid justify-items-center items-center">
												<FaUser className="w-[8px] h-[8px] text-lilac" />
											</div>
										<p className={`text-sm font-regular ml-2 ${index === hoveredIndex || selectedIndexes.includes(index)? 'text-lilac' : 'text-lilac opacity-60'}`}>{name}</p>
										</div>
									
								</div>
							))}
							<p className="absolute bottom-24 text-lilac pl-2 font-audiowide">{selectedIndexes.length}/3</p>
							</div>
							</div>
								<div className="flex flex-col justify-end mb-6">
									<div className="flex flex-row items-center my-2 m-auto ">
									<div className="border-t w-12 border-lilac"></div>
									<span className="mx-4 text-sm text-lilac">OR</span>
									<div className="border-t w-12 border-lilac"></div>
									</div>
									<div className="flex flex-row justify-between items-center bg-purple p-2 mx-4 rounded-md">
									<div onClick={() => { connectServ(); toggleCard(0); }} className="text-xs text-lilac">Random player</div>
										<IoIosArrowForward className="w-2 h-2 text-lilac"/>
									</div>
							</div>
						</div>
					) : (
						<div className="relative text-lilac">
							{!showSecondDiv? (
							<>
							<div className="pb-6">
								<div onClick={handleCrossClick} className="cross-icon cursor-pointer absolute right-0">
									&#x2715;
								</div>
							</div>
							<div className="flex justify-center h-5/6">
								<h3 className="absolute font-audiowide text-xl">Waiting for...</h3>
								<div className="w-full h-5/6 bg-filter my-4 p-4 flex flex-col justify-center items-center">
									<div>
										<div className="flex flex-row gap-x-8">
											<div className="flex flex-col items-center justify-content">
												<div className="element-to-animate rounded-full mt-2" style={{ width: '70px', height: '70px' }}>
													<FaUser className="absolute top-5 left-5 text-lilac z-50 " style={{ fontSize: '30px' }} />
												</div>
												<p>{invitedFriend?.username}</p>
											</div>
											<div className="flex flex-col items-center">
												<div className="element-to-animate rounded-full mt-2" style={{ width: '70px', height: '70px' }}>
													<FaUser className="absolute top-5 left-5 text-lilac z-50 " style={{ fontSize: '30px' }} />
												</div>
												<p>Name</p>
											</div>
										</div>
										<div className="flex flex-col items-center">
												<div className="element-to-animate rounded-full mt-2" style={{ width: '70px', height: '70px' }}>
													<FaUser className="absolute top-5 left-5 text-lilac z-50 " style={{ fontSize: '30px' }} />
												</div>
												<p>Name</p>
										</div>
									</div>
									<div className="mt-auto mb-1 w-full h-2 bg-violet-black relative">
										<div className="h-full bg-fushia" style={{ width: '50%' }} />
									</div>
								</div>
							</div>
							<p className="absolute bottom-14 text-lilac pl-2 font-audiowide">0/3</p>
							</>
							) : (
								<>
								<div className="pb-6">
									<div onClick={handleCrossClick} className="cross-icon cursor-pointer absolute right-0">
										&#x2715;
									</div>
								</div>
								<div className="flex justify-center h-5/6">
									<h3 className="absolute font-audiowide text-xl z-50">Unavailable</h3>
									<div className="w-full h-5/6 bg-filter opacity-50 my-4 p-4 flex flex-col justify-center items-center">
										<div>
											<div className="flex flex-row">
												<div className="bg-purple rounded-full mt-10" style={{ width: '80px', height: '80px' }}>
													<FaUser className="absolute transform translate-x-1/2  translate-y-1/2 text-lilac z-50 " style={{ fontSize: '40px' }} />
												</div>
												<p>Name</p>
											</div>
										</div>
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

					



					{/*GAME 3*/}
					<div className="flex w-full p-8 rounded-lg grid grid-rows-[auto,1fr,auto] bg-filter bg-opacity-75">
						<div>
							<Winner/>
							<Defeat/>
							<Draw/>
						</div>
					</div>
					
				</div>
			</div>


		</div>
	</MainLayout>
	)
}

export default Game