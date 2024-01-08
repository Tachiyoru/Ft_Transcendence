import { useLocation, useParams } from "react-router-dom";
import MainLayout from "../../components/nav/MainLayout"
import { FaUser } from "react-icons/fa6";
import { useEffect, useState } from "react";
import axios from "../../axios/api";
import DateConverter from "../../components/date/DateConverter";
import MatchesPlayedTogether from "../_root/container/MatchesPlayedTogether";
import BadgesUser from "./container/BadgesUser";
import Animation from "./container/Animation";
import LeaderboardUser from "./container/LeaderboardUser";

const DashboardFriends = () => {
	const location = useLocation();
	const currentPage = location.pathname;
	const [userData, setUserData] = useState<{id:number ;username: string; avatar: string; createdAt: string}>();
	const [userStats, setUserStats] = useState<{ partyPlayed: number; partyWon: number; partyLost: number, lvl: number; exp: number }>({
		partyPlayed: 0,
		partyWon: 0,
		partyLost: 0,
		lvl: 0,
		exp: 0,
	});
	const { userId } = useParams();

	useEffect(() => {
		const fetchData = async () => {
		try {
			console.log(userId);
			const response = await axios.get(`users/him/${userId}`);
			setUserData(response.data);

			const responsestat = await axios.get(`stats/${userId}`);
			setUserStats(responsestat.data);


		} catch (error) {
			console.error('Erreur lors de la récupération des données:', error);
		}
		};

		fetchData();
	}, [userId]);
	
	return (
	<MainLayout currentPage={currentPage}>
		<div className="flex-1 flex flex-row">

			{/*leftSideBar*/}
			<div className="md:w-[260px] md:rounded-l-lg bg-violet-black p-4 text-gray-300 text-xs">
			{userData ? (
				<div className="flex flex-col mt-4 mb-10 m-2">
				<div className="flex">
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
				<div className="mt-60 mb-10">
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
			</div>

			{/*Dashboard*/}
			<div className="flex-1 bg-violet-black-nav bg-opacity-80 p-4 md:rounded-r-lg">
				<div className="flex mx-2 flex-row gap-4 md:gap-6">
					<BadgesUser />
					<MatchesPlayedTogether/>
				</div>
				<div className="flex flex-row m-2 gap-4 md:gap-6">
					<Animation/>
					<LeaderboardUser/>
				</div>
			</div>
		</div>

	</MainLayout>
	)
}

export default DashboardFriends