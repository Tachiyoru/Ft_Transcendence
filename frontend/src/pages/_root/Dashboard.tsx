import { useLocation } from "react-router-dom";
import MainLayout from "../../components/nav/MainLayout"
import { FaUser, FaVolumeXmark } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import axios from '../../axios/api';
import Cookies from 'js-cookie';

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";


const Dashboard = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  const [userData, setUserData] = useState<{username: string; email: string}>();
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const token = Cookies.get('refresh_token');
    const fetchUserData = async () => {
      console.log(token);
      try {
        const response = await axios.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Error loading user data</div>;
  }


  return (
    <MainLayout currentPage={currentPage}>
        <div className="flex-1 md:flex flex-row">

          {/*leftSideBar*/}
          <div className="md:w-[260px] md:rounded-l-lg bg-violet-black p-4 text-gray-300 text-xs grid grid-rows-[auto,1fr,auto]">

              {/*User*/}
              <div className="flex mt-4 mb-10 m-2">
                <div className="bg-purple rounded-full p-2">
                  <FaUser className="w-[66px] h-[66px] p-3 text-lilac"/>
                </div>
                <div className="pl-4 pt-4">
                  <p className="text-xs font-light text-lilac">Member sinced 20/12/23</p>
                  <p className="text-sm font-semibold text-lilac">{userData.username} {userData.email}</p>
                  <p className="mt-2 text-xs font-medium text-white"><span className="bg-lilac py-[0.15rem] px-[0.4rem] rounded">Legend</span></p>
                </div>
              </div>
              
              <div>	
                <Link to="/settings">
									<div className="flex flex-row items-center bg-purple hover:bg-violet-black-nav mx-2 p-2 pl-5 rounded-md text-lilac text-sm">
										<IoSettingsSharp className="w-3 h-4 mr-2"/>
										<p>Edit Profile</p>
									</div>
								</Link>
              </div>

              <div className="mx-2">
                <div className='h-2 bg-white'>
                  <div
                      style={{ width: 40}}
                      className="h-full bg-purple">
                  </div>
                </div>
                <div className="flex flex-row justify-between mt-2 text-sm text-lilac">
                  <span>Level 1</span>
                  <span>20/400</span>
                </div>
              </div>

              {/*Stats*/}
              <div className="flex flex-col justify-end m-2">
                <div className="bg-purple dark:text-gray-200 gap-2 mt-2 h-24 dark:bg-secondary-dark-bg w-full px-2 py-2 rounded-md ">
                  <p className="text-sm text-lilac">Total</p>
                </div>
                <div className="flex gap-4 mt-4 flex-row">
                    <div className="flex bg-purple dark:text-gray-200 h-24 dark:bg-secondary-dark-bg w-full px-2 py-2 rounded-md ">
                      <p className="text-sm text-lilac">Win</p>
                    </div>

                    <div className="flex bg-purple dark:text-gray-200 h-24 dark:bg-secondary-dark-bg w-full px-2 py-2 rounded-md ">
                      <p className="text-sm text-lilac">Loss</p>
                    </div>
                </div>
              </div>

          </div>

          {/*Dashboard*/}
          <div className="flex-1 bg-black bg-opacity-40 p-4 md:rounded-r-lg">

            <div className="flex m-2 flex-row gap-4 md:gap-6">

                <div className="bg-purple dark:text-gray-200 h-40 dark:bg-secondary-dark-bg w-full lg:w-60 px-4 py-2  rounded-lg ">
                  <p><span className="text-sm text-lilac">Data</span></p>
                  <p className="text-gray-300 text-xs">Badges</p>

                </div>

                <div className="bg-purple dark:text-gray-200 h-40 dark:bg-secondary-dark-bg w-full lg:w-40 px-4 py-2  rounded-lg ">
                <p><span className="text-sm text-lilac">Data</span></p>
                  <p className="text-gray-300 text-xs">Badges</p>
                </div>

            </div>

            <div className="flex flex-row m-2 mt-6 gap-4 md:gap-6">

              <div className="bg-purple dark:text-gray-200 h-40 dark:bg-secondary-dark-bg w-full lg:w-40 px-4 py-2 rounded-lg ">
                <p><span className="text-sm text-lilac">Data</span></p>
                <p className="text-gray-300 text-xs">Podium</p>              
              </div>

              <div className="bg-purple h-40 dark:text-gray-200 dark:bg-secondary-dark-bg w-full lg:w-60 px-4 py-2 rounded-lg hidden md:block">
                <p><span className="text-sm text-lilac">Data</span></p>
                <p className="text-gray-300 text-xs">Podium</p>
              </div>

              <div className="bg-purple dark:text-gray-200 h-40 dark:bg-secondary-dark-bg w-full lg:w-40 px-4 py-2  rounded-lg ">
                <p><span className="text-sm text-lilac">Data</span></p>
                <p className="text-gray-300 text-xs">Top players</p>
              </div>
            </div>

              
            <div className="bg-purple text-normal h-60 rounded-md m-2 mt-6 px-4 py-2 pt-4">
                <div>
                  <p className="text-sm text-lilac">History</p>
                </div>
              </div>

            </div>
        </div>

    </MainLayout>
  )
}

export default Dashboard