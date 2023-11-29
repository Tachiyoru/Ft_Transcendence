import React, { useEffect, useState } from 'react';
import { FaArrowTurnUp, FaUserPlus } from "react-icons/fa6";
import AllFriends from './AllFriends';
import Invitations from './Invitations';
import Blocked from './Blocked';

type FilterType = 'tous' | 'invitations' | 'blocked'; 


const SetFriends: React.FC = () => {

	const [isTyping, setIsTyping] = useState(false);
  const [filtreActif, setFiltreActif] = useState<FilterType>('tous');

	const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setIsTyping(inputValue !== '');
  };

  const handleFiltre = (type: FilterType) => {
    setFiltreActif(type);
    window.location.hash = type;
  };

  const contenuFiltre: { [key in FilterType]: JSX.Element } = {
    tous: <AllFriends/>,
    invitations: <Invitations/>,
    blocked: <Blocked/>,
  };

  useEffect(() => {
    // Met à jour le filtre actif lorsque l'URL change
    const hash = window.location.hash.substr(1) as FilterType;
    if (hash && ['tous', 'invitations', 'blocked'].includes(hash)) {
      setFiltreActif(hash);
    }
  }, []);

  return (
      <div className="flex flex-row h-[80vh]">

        {/*NAV FRIENDS*/}
        <div className="w-[260px] md:rounded-l-lg bg-violet-black">
          <div className='p-4'>
            <h1 className="font-outline-2 mt-6 m-2 text-white">Friends</h1>
              <div className="relative m-2">
                <div className="flex items-center">
                  <input
                    type='text'
                    placeholder='Add friends'
                    className="text-xs placeholder-lilac text-lilac py-2 pl-9 pr-2 w-full mt-4 rounded-md bg-purple focus:outline-none focus:border-fushia"
                    onChange={handleInputChange}
                  />
                  <span className="absolute inset-y-0 left-0 pl-3 pt-3.5 flex items-center">
                    {isTyping ? (
                      <FaArrowTurnUp className="text-violet-black mt-1 w-3 h-3 transform rotate-90"/>
                    ) : (
                      <FaUserPlus className="text-violet-black w-4 h-4"/>
                    )}
                  </span>
                </div>
            </div>
          </div>

            <nav>
              <ul className='mt-2 ml-10'>
                <li className={`mb-2 text-sm text-lilac ${filtreActif === 'tous' ? 'bg-violet-black-nav py-2 pl-4 rounded-l-md' : 'py-2 pl-4'}`} onClick={() => handleFiltre('tous')}>All Friends</li>
                <li className={`mb-2 text-sm text-lilac ${filtreActif === 'invitations' ? 'bg-violet-black-nav py-2 pl-4 rounded-l-md' : 'py-2 pl-4'}`} onClick={() => handleFiltre('invitations')}>Invitations</li>
                <li className={`mb-2 text-sm text-lilac ${filtreActif === 'blocked' ? 'bg-violet-black-nav py-2 pl-4 rounded-l-md' : 'py-2 pl-4'}`} onClick={() => handleFiltre('blocked')}>Blocked</li>
              </ul>
            </nav>
      </div>

      {/*NAV FRIENDS*/}
      <div className="flex-1 bg-black bg-opacity-70 p-4 md:rounded-r-lg"> 
        {contenuFiltre[filtreActif]}
      </div>
    </div>
  );
};

export default SetFriends;
