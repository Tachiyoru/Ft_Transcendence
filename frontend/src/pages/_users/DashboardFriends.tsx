import { useLocation, useParams } from "react-router-dom";
import MainLayout from "../../components/nav/MainLayout"
import { FaUser } from "react-icons/fa6";
import { useEffect, useState } from "react";
import axios from "../../axios/api";
import DateConverter from "../../components/date/DateConverter";
import { IoSettingsSharp } from "react-icons/io5";

const DashboardFriends = () => {
  const location = useLocation();
  const currentPage = location.pathname;
  const [userData, setUserData] = useState<{id:number ;username: string; avatar: string; createdAt: string}>();

  const { userId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(userId);
        const response = await axios.get(`users/him/${userId}`);

        setUserData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, [userId]);
  
  return (
    <MainLayout currentPage={currentPage}>
        <div className="flex-1 flex flex-row">

          {/*leftSideBar*/}
          <div className="w-[260px] rounded-l-lg bg-violet-black p-4 text-gray-300 text-xs grid grid-rows-[auto,1fr,auto]">
          {userData ? (
              <div className="flex mt-4 mb-10 m-2">
                {userData.avatar ? (
                  <img src={userData.avatar} className="h-20 w-20 object-cover rounded-full text-lilac" alt="User Avatar" />
                ) : (
                  <div className="bg-purple rounded-full p-2 mt-2">
                    <FaUser className="w-[60px] h-[60px] p-3 text-lilac"/>
                  </div>
                )}
                <div className="pl-4 pt-4">
                  <DateConverter initialDate={userData.createdAt}/>
                  <p className="text-sm font-semibold text-lilac">{userData.username}</p>
                  <p className="mt-2 text-xs font-medium text-white"><span className="bg-lilac py-[0.15rem] px-[0.4rem] rounded">Legend</span></p>
                </div>
              </div>
              
            ) : (
              <p className="text-lilac">User not found</p>
            )}
          </div>

          {/*Dashboard*/}
          <div className="flex-1 bg-black bg-opacity-40 p-4 rounded-r-lg">

          </div>
        </div>

    </MainLayout>
  )
}

export default DashboardFriends