import { useLocation, useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../components/nav/MainLayout"
import { FaRegPenToSquare, FaUser, FaUserMinus, FaUserPlus } from "react-icons/fa6";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "../../axios/api";
import DateConverter from "../../components/date/DateConverter";
import MatchesPlayedTogether from "../_root/container/MatchesPlayedTogether";
import BadgesUser from "./container/BadgesUser";
import Animation from "./container/Animation";
import LeaderboardUser from "./container/LeaderboardUser";
import { Link } from "react-router-dom";
import { RiGamepadFill } from "react-icons/ri";
import { FaMinusCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { WebSocketContext } from "../../socket/socket";
import { setSelectedChannelId } from "../../services/selectedChannelSlice";
import { RiTimer2Line } from "react-icons/ri";

interface Users {
	username: string;
	avatar: string;
	id: number;
	status: string;
}

const DashboardFriends = () => {
	const location = useLocation();
	const currentPage = location.pathname;
	const [userData, setUserData] = useState<Users>();
	const [userStats, setUserStats] = useState<{ partyPlayed: number; partyWon: number; partyLost: number, lvl: number; exp: number }>({
		partyPlayed: 0,
		partyWon: 0,
		partyLost: 0,
		lvl: 0,
		exp: 0,
	});
	const { username } = useParams();
	const [friend, setFriend] = useState<Users | null >();
	const [friendPending, setFriendPending] = useState<Users | null>();
	const [blockedUser, setBlockedUser] = useState<Users | null>();
	
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`users/him/${username}`);
			setUserData(response.data);
			
			const responsestat = await axios.get(`stats/${username}`);
			setUserStats(responsestat.data);
			
		} catch (error) {
			console.error('Erreur lors de la récupération des données:', error);
		}
	};
	
	fetchData();
	}, [username]);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const socket = useContext(WebSocketContext);

	const handleClickSendMessage = (username: string, id: number) => {
		socket.emit('getOrCreateChatChannel', { username2: username, id: id }); 
		socket.on('chatChannelCreated', (data) => {
			dispatch(setSelectedChannelId(data.channelId));
			navigate('/chat')
		});
	}

	const addFriend = useCallback(async () => {
		try {
			await axios.post(`/friends-list/friend-request/${userData?.id}`);
			setFriendPending(userData);
			setFriend(null);
		} catch (error) {
			console.error("Error adding friend:", error);
		}
	}, [userData]);

	const removeFriend = async () => {
		try {
			await axios.delete(`/friends-list/remove/${userData?.id}`);
			setFriend(null);
		} catch (error) {
			console.error("Error deleting friend:", error);
		}
	};

	useEffect(() => {
		const fetchUserData = async () => {
			try {
			const response = await axios.get<Users[]>(
				"/friends-list/mine"
			);

			const foundUser = response.data.find((user) => user.username === username);
			if (username && foundUser)
				setFriend(foundUser);
			else 
				setFriend(null);
			} catch (error) {
			console.error("Error fetching user list:", error);
			}
		};
		fetchUserData();
	}, [username]);

	useEffect(() => {
		const fetchUserData = async () => {
		try {
			const response = await axios.get<Users[]>(
				"/friends-list/pending-request/"
				);
			const foundUser = response.data.find((user) => user.username === username);
			if (username && foundUser)
				setFriendPending(foundUser);
			else 
				setFriendPending(null);
			} catch (error) {
				console.error("Error fetching user list:", error);
			}
		};
		fetchUserData();
	}, [username, addFriend]);

	useEffect(() => {
		const fetchBlockedUsers = async () => {
		try {
			const response = await axios.get<Users[]>("/friends-list/blocked-users");
			const foundUser = response.data.find((user) => user.username === username);
			if (username && foundUser)
				setBlockedUser(foundUser);
			else 
				setBlockedUser(null);
		} catch (error) {
			console.error("Error fetching blocked users:", error);
		}
		};

		fetchBlockedUsers();
	}, []);

	const blockUser = async (userId: number) => {
		try {
			await axios.post(`/friends-list/block/${userId}`);
		} catch (error) {
			console.error('Erreur lors du blocage de l\'utilisateur :', error);
		}
	};

	const unblockUser = async (userId: number) => {
		try {
		await axios.post(`/friends-list/unblock/${userId}`);
		} catch (error) {
		console.error("Error deblocked users:", error);
		}
	};

	const handleBlockUser = async (user: Users) => {
		try {
			if (blockedUser !== null) {
				await unblockUser(user.id);
				setBlockedUser(null);

			} else {
				await blockUser(user.id);
				setBlockedUser(user);
			}
		} catch (error) {
			console.error('Erreur lors du blocage ou deblocage de l\'utilisateur :', error);
		}
	};


return (
	<MainLayout currentPage={currentPage}>
		<div className="flex-1 flex flex-row">
			{/*leftSideBar*/}
				{userData ? (
					<div className="md:w-[260px] md:rounded-l-lg bg-violet-black p-4 text-xs">
					<div className="flex mt-4 mb-10 m-2">
					{userData.avatar ? (
						<img src={userData.avatar} className="h-20 w-20 object-cover rounded-full text-lilac" alt="User Avatar" />
					) : (
						<div className="bg-purple rounded-full p-2 mt-2">
							<FaUser className="w-[60px] h-[60px] p-3 text-lilac"/>
						</div>
					)}
						<div className="pl-4 pt-4">
							<DateConverter initialDate={userData.createdAt}/>
							<p className="text-sm font-semibold text-lilac">{userData.username}</p>
							<p className="mt-2 text-xs font-medium text-white"><span className="bg-lilac py-[0.15rem] px-[0.4rem] rounded">Legend</span></p>
						</div>
					</div>

					<div className="flex flex-col gap-y-2">
						<div 
						onClick={() => handleClickSendMessage(userData.username, userData.id)}
						className="flex flex-row items-center bg-purple hover:bg-violet-black-nav p-2 pl-5 rounded-md text-lilac text-sm cursor-pointer"
						>
							<FaRegPenToSquare className="w-3 h-4 mr-2"/>
							<p>Send a message</p>
						</div>

						<Link to="/settings">
							<div className="flex flex-row items-center bg-purple hover:bg-violet-black-nav p-2 pl-5 rounded-md text-lilac text-sm">
								<RiGamepadFill className="w-3 h-4 mr-2"/>
								<p>Invite to play</p>
							</div>
						</Link>

						<div 
							className={`flex flex-row items-center bg-purple p-2 pl-5 rounded-md text-lilac text-sm ${friendPending ? 'opacity-40' : 'hover:bg-violet-black-nav cursor-pointer'}`}
							onClick={!friend ? addFriend : (friendPending ? null : removeFriend)}
						>
							{!friend && !friendPending ? <FaUserPlus className="w-3 h-4 mr-2"/> : friendPending ?  (<RiTimer2Line className="w-3 h-4 mr-2"/>) : (<FaUserMinus className="w-3 h-4 mr-2"/>)}
							<p>{!friend && !friendPending ? 'Add as friend' : (friendPending ? 'Pending invitation' : 'Remove from friend')}</p>

						</div>

						<div
							onClick={() => handleBlockUser(userData)}
							className="flex flex-row items-center bg-purple hover:bg-violet-black-nav p-2 pl-5 rounded-md text-lilac text-sm"
						>
							<FaMinusCircle className="w-3 h-4 mr-2"/>
							<p className={`${blockedUser ? 'text-red-orange' : ''} `}>{blockedUser ? 'Unblock user' : 'Block user'}</p>
						</div>
					</div>

					<div className="mt-40 mb-10">
						<div className='h-1 bg-white'>
							<div
							style={{ width: userStats.exp }}
							className="h-full bg-purple">
							</div>
						</div>
						<div className="flex flex-row justify-between mt-2 text-sm text-lilac">
							<span>Level {userStats.lvl}</span>
							<span>{userStats.exp}/400</span>
						</div>
					</div>

					<div className="flex flex-col justify-end">
						<div className="bg-accent-violet font-kanit font-extrabold flex flex-row items-center p-4 mt-2 h-24 w-full rounded-md ">
							<p className="text-5xl text-lilac">{userStats.partyPlayed}</p>
							<div className="pt-7 text-xl text-purple ml-2">
								<p style={{ marginBottom: '-0.7rem' }}>matches</p>
								<p>played</p>
							</div>
						</div>

					<div className="flex mt-4 gap-4 flex-row">
						<div className="font-kanit font-extrabold bg-accent-violet h-24 w-1/2 px-4 rounded-md">
							<p className="text-4xl text-fushia" style={{ marginTop: '-0.7rem' }}>{userStats.partyWon}</p>
							<p className="text-xl text-purple" style={{ marginTop: '-1.5rem' }}>victories</p>
						</div>

						<div className="font-kanit font-extrabold bg-accent-violet h-24 w-1/2 px-4 rounded-md">
							<p className="text-4xl text-violet-black" style={{ marginTop: '-0.7rem' }}>{userStats.partyLost}</p>
							<p className="text-xl text-purple" style={{ marginTop: '-1.5rem' }}>defeats</p>
						</div>
					</div>
				
				</div>
				</div>

				
			) : (
				<p className="text-lilac">User not found</p>
			)}
			
				<div className="flex-1 bg-violet-black-nav bg-opacity-80 p-4 md:rounded-r-lg">
					<div className="flex mx-2 flex-row gap-4 md:gap-6">
						<BadgesUser user={userData}/>
						<MatchesPlayedTogether/>
					</div>
					<div className="flex flex-row m-2 gap-4 md:gap-6">
						<Animation/>
						<LeaderboardUser/>
					</div>
				</div>
			</div>
			{/*Dashboard*/}

	</MainLayout>
	)
}

export default DashboardFriends