import React, { useState } from "react";
import axios from "../../../axios/api";

interface Badge {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface BadgesSectionProps {
  userAchievements: Badge[];
  //   onSelectBadge: (badgeId: number) => void;
}

const Badges: React.FC<BadgesSectionProps> = ({ userAchievements }) => {
  const [selectedBadgeId, setSelectedBadgeId] = useState<number | null>(null);

  const handleBadgeClick = async (badgeId: number) => {
    console.log("handleBadgeClick", badgeId);
    setSelectedBadgeId(badgeId);
    console.log(`Badge selected: ${badgeId}`);
    await axios.patch(`achievements/settitle/${badgeId}`);
    badgeId = 0;
  };
  const badgeIds = userAchievements.map(badge => badge.id);

  const achievementTitles = [
    "Link your profile to 42 or Github",
    "10 times winner",
    "Top 3 worldwide",
    "Take revenge",
    "First game",
    "Winner 5 times in a row",
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
              className={`w-12 h-12 m-1 ${
                selectedBadgeId === badge.id ? "selected" : ""
              }`}
              title={`${badge.description}`}
              onClick={() => handleBadgeClick(badge.id)}
            >
              <img src={badge.icon} alt={badge.title} />
            </div>
          ))}
            {[...Array(8)].map((_, index) => (
              !badgeIds.includes(index + 1) && (
                <div key={index} className="w-12 h-12 m-1 opacity-20" title={achievementTitles[index]}>
                  <img src={`src/achievements-${index + 1}.png`} alt={achievementTitles[index]} />
                </div>
              )
            ))}
        </div>
      </div>
    </div>
  );
};

export default Badges;
