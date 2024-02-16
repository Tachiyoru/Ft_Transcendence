import axios from "../axios/api";

interface User {
	username: string;
	avatar: string;
	createdAt: string;
	id: number;
	title: string;
}

interface Achievement {

	icon: string;
	id: number;
	idType: number;
	title: string;
	description: string;
}

interface FetchDataParams {
  setUserData: React.Dispatch<
    React.SetStateAction<
			User | undefined
    >
  >;
  setUserStats: React.Dispatch<
    React.SetStateAction<{
      partyPlayed: number;
      partyWon: number;
      partyLost: number;
      lvl: number;
			exp: number;
			history: string[];
    }>
  >;
  setUserRankingGlobal: React.Dispatch<
		React.SetStateAction<{ username: string;  id: number;}[]>
  >;
  setUserRankingFriends: React.Dispatch<
    React.SetStateAction<{ username: string }[]>
  >;
  setUserAchievements: React.Dispatch<
		React.SetStateAction<Achievement[]>
  >;
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
    const userDataResponse = await axios.get("/users/me");
    setUserData(userDataResponse.data);

    const userStatResponse = await axios.get("/stats/mine");
    setUserStats(userStatResponse.data);

    const userRankingGlobals = await axios.get("/users/ranking-global");
    setUserRankingGlobal(userRankingGlobals.data);

    const userRankingFriends = await axios.get("/users/ranking-friends");
    setUserRankingFriends(userRankingFriends.data);

    const username = userDataResponse.data.username;
    if (username.includes("_42") || username.includes("_git")) {
      await axios.post(`achievements/add/${1}`);
    }
    const userInTop3 = userRankingGlobals.data
      .slice(0, 3)
      .some((user: User) => user.id === userDataResponse.data.id);
    if (userInTop3) {
      await axios.post(`achievements/add/${3}`);
    }

    const userAchievementsResponse = await axios.get("/achievements/mine");
		const userAchievementsData = userAchievementsResponse.data;
    // setUserAchievements(userAchievementsResponse.data);

    if (userStatResponse.data && userAchievementsData) {
      //first game
      if (
				userStatResponse.data.partyPlayed >= 1 &&
        !userAchievementsData.some((achievement: Achievement) => achievement.idType === 5)
				) {
					await axios.post(`achievements/add/${5}`);
				}
				//win 10 parties
				if (
					userStatResponse.data.partyWon >= 10 &&
					!userAchievementsData.some((achievement: Achievement) => achievement.idType === 2)
					) {
						await axios.post(`achievements/add/${2}`);
					}
					//did 42 parties
					if (
						userStatResponse.data.partyPlayed >= 42 &&
						!userAchievementsData.some((achievement: Achievement) => achievement.idType === 7)
						) {
							await axios.post(`achievements/add/${7}`);
						}
						//lose 10 parties in a row
						let consecutiveDefeats = 0;
						const history = userStatResponse.data.history;
						for (let i = 0; i < history.length; i++) {
							const currentItem = history[i];
							if (currentItem.includes(`Defeat`)) {
								consecutiveDefeats++;
								if (consecutiveDefeats === 10)
								await axios.post(`achievements/add/${8}`);
						} else {
							consecutiveDefeats = 0;
						}
					}
				}

				const updatedAchievements = await axios.get("/achievements/mine");
				const filteredAchievements = [...updatedAchievements.data].filter(
        (achievement, index, self) =>
          index === self.findIndex((a) => a.idType === achievement.idType)
      	);
				setUserAchievements(filteredAchievements);
			} catch (error) {
				console.error("Error fetching user data:", error);
  } finally {
    setLoading(false);
  }
};
