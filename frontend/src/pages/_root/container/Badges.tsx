// BadgesSection.tsx
import React from 'react';

interface BadgesSectionProps {
	userAchievements: { icon: string }[];
}


const Badges: React.FC<BadgesSectionProps> = ({ userAchievements }) => {
	console.log ('BadgesSectionProps', userAchievements);
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

export default Badges;
