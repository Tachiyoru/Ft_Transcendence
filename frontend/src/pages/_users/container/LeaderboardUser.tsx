import { useParams } from 'react-router-dom';
import HighlightMiddle from '../../_root/container/HighlightMiddle';
import { useEffect, useState } from 'react';
import axios from '../../../axios/api';
import { Link } from 'react-router-dom';

const LeaderboardUser = () => {
	const [userRankingGlobal, setUserRankingGlobal] = useState<{ username: string; }[]>([]);
	const [userRankingFriends, setUserRankingFriends] = useState<{ username: string; }[]>([]);
	const { userId } = useParams();
	
	useEffect(() => {
		const fetchData = async () => {
			try {
			const userRankingGlobals = await axios.get('/users/ranking-global');
			setUserRankingGlobal(userRankingGlobals.data);

			const userRankingFriends = await axios.get('/users/ranking-friends');
			setUserRankingFriends(userRankingFriends.data);
		} catch (error) {
			console.error('Erreur lors de la récupération des données:', error);
		}
		};

		fetchData();
	}, [userId]);


	return (
		<>
		<div className="w-full relative lg:w-60">
			<p><span className="text-2xl pl-2 font-audiowide absolute text-lilac my-4" style={{ marginTop: '0rem' }}>Leaderboards</span></p>
			<div className="bg-purple lg:w-60 h-40 my-5 py-4 rounded-lg">
			<p><span className="text-xl pl-2 font-kanit font-extrabold text-fushia">Friends</span></p>
			<div className="overflow-x-auto">
				<table className="w-full text-lilac">
				<tbody className="text-xs">
					{userRankingFriends.length === 0 ? (
					<tr>
						<td className="px-2" colSpan={3}>No friends for the moment.</td>
					</tr>
					) : (
					userRankingFriends.map((friend, index) => (
						<tr key={index} className={index % 2 === 0 ? "bg-accent-violet" : ""}>
						<td className="px-2">{friend.username}-</td>
						</tr>
					))
					)}
				</tbody>
				</table>
			</div>
			<div className="flex flex-wrap absolute text-lilac right-2 bottom-2">
				{[1, 2, 3].map((badge) => (
				<div
					key={badge}
					className="w-6 h-6 bg-fushia rounded-full ml-1 mix-blend-difference"
				/>
				))}
			</div>
			</div>
		</div>

		<div className="w-full relative">
			<div className="bg-purple lg:w-40 h-40 rounded-lg my-5 bg-opacity-70">
			<div className="shadow-inner-custom px-4 py-4 h-40 rounded-lg">
				<HighlightMiddle>
				<div className="h-20 py-2 overflow-y-auto max-h-20 scrollbar-thin scrollbar-thumb-black">
					{userRankingGlobal.map((user, index) => (
					<Link key={index} to={`/user/${user.username}`}>
						<div key={index} className="px-4 text-xs text-lilac" style={{ marginTop: '-0.14rem' }}>
							{`${index + 1}-${user.username}`}
						</div>
					</Link>
					))}
				</div>
				</HighlightMiddle>
			</div>
			</div>
		</div>
		</>
	);
};

export default LeaderboardUser;
