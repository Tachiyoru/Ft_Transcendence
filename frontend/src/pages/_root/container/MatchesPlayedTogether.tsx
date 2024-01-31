import React from 'react';

interface MatchesPlayedTogetherProps {
	history: string[];
	username: string;
  }

const MatchesPlayedTogether: React.FC<MatchesPlayedTogetherProps> = ({ history, username }) => {
	const count = history.filter((item) => item.includes(`${username}`)).length;

  return (
    <div className="sm:w-full relative lg:w-40">
      <p>
        <span
          className="text-4xl pl-2 absolute font-kanit font-extrabold text-fushia mix-blend-difference"
          style={{ marginTop: '-0.7rem' }}
        >
          {count}
        </span>
      </p>
      <div className="bg-purple lg:w-40 h-40 rounded-lg my-8 bg-opacity-80">
        <div className="shadow-inner-custom px-4 py-4 h-40 rounded-lg">
          <p className="text-2xl font-kanit font-extrabold text-fushia pt-4" style={{ lineHeight: '1.4rem' }}>
            games <br /> played <br /> together
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchesPlayedTogether;
