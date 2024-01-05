import { useState } from 'react';

export const useDashboardState = () => {
	const [userData, setUserData] = useState<{ username: string; avatar: string; createdAt: string }>();
	const [userStats, setUserStats] = useState<{ partyPlayed: number; partyWon: number; partyLost: number, lvl: number; exp: number }>({
	partyPlayed: 0,
	partyWon: 0,
	partyLost: 0,
	lvl: 0,
	exp: 0,
	});
	const [userRankingGlobal, setUserRankingGlobal] = useState<{ username: string; }[]>([]);
	const [userRankingFriends, setUserRankingFriends] = useState<{ username: string; }[]>([]);
	const [userAchievements, setUserAchievements] = useState<{ icon: string }[]>([]);
	const [loading, setLoading] = useState(true);

	return {
	userData,
	setUserData,
	userStats,
	setUserStats,
	userRankingGlobal,
	setUserRankingGlobal,
	userRankingFriends,
	setUserRankingFriends,
	userAchievements,
	setUserAchievements,
	loading,
	setLoading,
	};
};
