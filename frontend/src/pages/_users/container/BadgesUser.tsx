import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../axios/api";

const BadgesUser = () => {
	const [userAchievements, setUserAchievements] = useState<{ icon: string }[]>([]);
	const { userId } = useParams();

	useEffect(() => {
		const fetchData = async () => {
		try {
			console.log(userId);
			const response = await axios.get(`achievements/${userId}`);
			setUserAchievements(response.data);

		} catch (error) {
			console.error('Erreur lors de la récupération des données:', error);
		}
		};

		fetchData();
	}, [userId]);
	
	return (
		<div className="w-full lg:w-60 relative">
			<p><span className="text-2xl pl-2 font-audiowide absolute text-lilac my-4">Badges</span></p>
			<div className="lg:w-60 h-40 my-5 p-2 rounded-lg mt-12">
				<div className="flex flex-wrap">
					{userAchievements.map((user, index) => (
						<div
							key={index}
							className="w-12 h-12 m-1"
						>
							<img src={user.icon} />
						</div>
					))}
				</div>
			</div>
		</div>
);
};

export default BadgesUser;