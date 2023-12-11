import React, { useEffect, useState } from 'react';
import { FaArrowTurnUp, FaUser, FaUserPlus } from "react-icons/fa6";
import AllFriends from './AllFriends';
import Invitations from './Invitations';
import Blocked from './Blocked';
import axios from "../../../axios/api";

type FilterType = 'tous' | 'invitations' | 'blocked'; 


const SetFriends: React.FC = () => {

	const [isTyping, setIsTyping] = useState(false);
  const [filtreActif, setFiltreActif] = useState<FilterType>('tous');
	const [listUsers, setListUsers] = useState<{ id: number}[]>([]);
	const [checkedItems, setCheckedItems] = useState<{ [key: string]: { id: number } }>({});

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get<{ id: number }[]>('/friends-list/non-friends');
				console.log(response.data);
				
				setListUsers(response.data);
				} catch (error) {
				console.error('Error fetching user list:', error);
				}
			};
		fetchUserData();
	}, []);

  const handleCheckboxChange = (user: { id: number }) => {
		setCheckedItems(prevCheckedItems => {
			const newCheckedItems = { ...prevCheckedItems };
			if (newCheckedItems[user.id]) {
			delete newCheckedItems[user.id];
			} else {
			newCheckedItems[user.id] = user;
			}
			return newCheckedItems;
		});
	};

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

  const handleSubmit = async () => {
		const selectedItems = Object.values(checkedItems);
		console.log('Selection:', selectedItems);
    console.log('Selection:', selectedItems[0].id);
    try {
      const response = await axios.post(`/friends-list/add/${selectedItems[0].id}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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
          <div className='h-32 overflow-auto pr-3'>
          {listUsers.map((user, index) => (
            
            <div key={index} className='flex flex-row justify-between items-center mt-2'>
            <div className="flex items-center">
            <div className="w-[20px] h-[20px] bg-purple rounded-full grid justify-items-center items-center">
              <FaUser className="w-[8px] h-[8px] text-lilac"/>
            </div>
            <p className='text-sm font-regular ml-2'>{user.id}</p>
            </div>

            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <input
              type="checkbox"
              checked={checkedItems[user.id] !== undefined}
              onChange={() => handleCheckboxChange(user)} 
              className="h-5 w-5 rounded border border-gray-300 focus:ring-indigo-500 text-indigo-600"
              />
            </label>
          </div>
          ))}
            <button
            disabled={Object.keys(checkedItems).length === 0}
            className={`mt-4 px-4 py-2 text-sm rounded-md 
            ${Object.keys(checkedItems).length === 0 ? 'bg-purple opacity-50 text-lilac cursor-not-allowed' : 'bg-purple text-lilac cursor-pointer'}`}
            onClick={handleSubmit}
            >
              Add friend
            </button>
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
