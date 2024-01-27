import axios from "../axios/api";

interface FetchDataParams {
	setUserData: React.Dispatch<React.SetStateAction<{ username: string; avatar: string; createdAt: string } | undefined>>;
	setUserStats: React.Dispatch<React.SetStateAction<{ partyPlayed: number; partyWon: number; partyLost: number; lvl: number; exp: number }>>;
	setUserRankingGlobal: React.Dispatch<React.SetStateAction<{ username: string; }[]>>;
	setUserRankingFriends: React.Dispatch<React.SetStateAction<{ username: string; }[]>>;
	setUserAchievements: React.Dispatch<React.SetStateAction<{ icon: string }[]>>;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}


export const fetchDataUser = async ({
	setUserData,
	setUserStats,
	setUserRankingGlobal,
	setUserRankingFriends,
	setUserAchievements,
	setLoading,
}: FetchDataParams) => {
	try {
		const userDataResponse = await axios.get('/users/me');
		setUserData(userDataResponse.data);

		const userStatResponse = await axios.get('/stats/mine');
		setUserStats(userStatResponse.data);

		const userRankingGlobals = await axios.get('/users/ranking-global');
		setUserRankingGlobal(userRankingGlobals.data);

		const userRankingFriends = await axios.get('/users/ranking-friends');
		setUserRankingFriends(userRankingFriends.data);

		const username = userDataResponse.data.username;
		if (username.includes("_42") || username.includes("_git")) { await axios.post(`achievements/add/${1}`);}
		const userInTop3 = userRankingGlobals.data.slice(0, 3).some(user => user.id === userDataResponse.data.id);
		if (userInTop3) {
			await axios.post(`achievements/add/${2}`);
		}

		const userAchievements = await axios.get('/achievements/mine');
		setUserAchievements(userAchievements.data);

	} catch (error) {
		console.error('Error fetching user data:', error);
	} finally {
		setLoading(false);
	}
};

