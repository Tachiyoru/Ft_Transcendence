import React, { useState } from 'react';
import AccountEdit from './AccountEdit';
import SecurityEdit from './SecurityEdit';

type FilterType = 'tous' | 'privacy'; 

const AccountSetting: React.FC = () => {
  const [filtreActif, setFiltreActif] = useState<FilterType>('tous');


  const handleFiltre = (type: FilterType) => {
    setFiltreActif(type);
  };

  const contenuFiltre: { [key in FilterType]: JSX.Element } = {
    tous: <AccountEdit/>,
    privacy: <SecurityEdit/>,
  };

  return (
      <div className="flex flex-row h-[80vh]">

        {/*NAV SETTINGS*/}
        <div className="w-[260px] md:rounded-l-lg bg-violet-black">
          <div className='p-4'>
            <h1 className="font-outline-2 mt-6 m-2 text-white">Settings</h1>
             
          </div>

            <nav>
              <ul className='mt-2 ml-10'>
                <li className={`mb-2 text-sm text-lilac ${filtreActif === 'tous' ? 'bg-violet-black-nav py-2 pl-4 rounded-l-md' : 'py-2 pl-4'}`} onClick={() => handleFiltre('tous')}>Profile and account</li>
                <li className={`mb-2 text-sm text-lilac ${filtreActif === 'privacy' ? 'bg-violet-black-nav py-2 pl-4 rounded-l-md' : 'py-2 pl-4'}`} onClick={() => handleFiltre('privacy')}>Password and Security</li>
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

export default AccountSetting