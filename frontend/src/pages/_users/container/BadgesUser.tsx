import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../axios/api";

interface Badge {
	id: number;
	icon: string;
	title: string;
	description: string;
  }

  interface BadgesSectionProps {
	userAchievements: Badge[];
  }

const BadgesUser : React.FC<BadgesSectionProps> = ({ userAchievements }) => {
	const badgeIds = userAchievements.map(badge => badge.id);

	const achievementTitles = [
	  "Link your profile to 42 or Github",
	  "10 times winner",
	  "Top 3 worldwide",
	  "Take revenge",
	  "First game",
	  "Changed your avatar/username",
	  "Did 42 games",
	  "Serial looser : lose 10 times in a row",
	];
  
	return (
	  <div className="w-full lg:w-60 relative">
		<p>
		  <span className="text-2xl pl-2 font-audiowide absolute text-lilac my-4">
			Badges
		  </span>
		</p>
		<div className="lg:w-60 h-40 my-5 p-2 rounded-lg mt-12">
		  <div className="flex flex-wrap w-60">
			{userAchievements.map((badge, index) => (
			  <div
				key={index}
				className={`w-12 h-12 m-1`}
				title={`${badge.description}`}
			  >
				<img src={'/' + badge.icon} alt={badge.title} />
			  </div>
			))}
			  {[...Array(8)].map((_, index) => (
				!badgeIds.includes(index + 1) && (
				  <div key={index} className="w-12 h-12 m-1 opacity-20" title={achievementTitles[index]}>
					<img src={`/src/achievements-${index + 1}.png`} alt={achievementTitles[index]} />
				  </div>
				)
			  ))}
		  </div>
		</div>
	  </div>
	);
  };

export default BadgesUser;