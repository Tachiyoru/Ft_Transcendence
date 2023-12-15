import { useLocation } from "react-router-dom";
import MainLayout from "../../components/nav/MainLayout"
import { FaUser } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import axios from '../../axios/api';



import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DateConverter from "../../components/date/DateConverter";


const Dashboard = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  const [userData, setUserData] = useState<{username: string; avatar: string; createdAt: string}>();
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/users/me');
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
                <div className="bg-purple font-audiowide gap-2 mt-2 h-24 w-full p-4 rounded-md ">
                  <p className="text-2xl text-lilac">125</p>
                  <p className="text-sm text-lilac">Total</p>
                </div>
                <div className="flex gap-4 mt-4 flex-row">
                    <div className="flex-col font-audiowide bg-purple h-24 w-full p-4 rounded-md ">
                      <p className="text-2xl text-lilac">25</p>
                      <p className="text-sm text-lilac">Win</p>
                    </div>

                    <div className="flex-col font-audiowide bg-purple h-24 w-full p-4 rounded-md ">
                      <p className="text-2xl text-lilac">25</p>
                      <p className="text-sm text-lilac">Loss</p>
                    </div>
                </div>
              </div>

          </div>

          {/*Dashboard*/}
          <div className="flex-1 bg-violet-black-nav bg-opacity-80 p-4 md:rounded-r-lg">

            <div className="flex mx-2 flex-row gap-4 md:gap-6">

              <div className="w-full lg:w-60 relative">
                <p><span className="text-2xl pl-2 font-audiowide absolute text-lilac mix-blend-difference	">Badges</span></p>
                <div className="bg-purple lg:w-60 h-40 my-5 p-2 rounded-lg ">
                <div className="flex flex-wrap">
                {[1, 2, 3, 4].map((badge) => (
                    <div
                        key={badge}
                        className="w-12 h-12 bg-lilac rounded-full m-1"
                    />
                ))}
        </div>

                </div>
              </div>

              <div className="sm:w-full relative lg:w-40">
                <p><span className="text-2xl pl-2 font-audiowide absolute text-fushia mix-blend-difference">4</span></p>
                <div className="bg-purple lg:w-40 h-40 rounded-lg my-5 bg-opacity-80">
                  <div className="shadow-inner-custom px-4 py-4 h-40 rounded-lg">
                    <p className="text-fushia text-xl font-audiowide">matches <br/>played <br/>together</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex flex-row m-2 gap-4 md:gap-6">
            
              <div className="w-full relative lg:w-40">
              <div className="bg-purple lg:w-40 h-40 rounded-lg my-5 bg-opacity-80">
                  <div className="shadow-inner-custom px-4 py-4 h-40 rounded-lg">
                  <p className="text-gray-300 text-xs"></p>
                  </div>
                </div>
              </div>

              <div className="w-full relative lg:w-60 ">
                <p><span className="text-2xl pl-2 font-audiowide absolute  text-lilac mix-blend-difference">Ranking</span></p>
                <div className="bg-purple lg:w-60 h-40 my-5 py-6 rounded-lg ">
                  <div className="overflow-x-auto">
                  <table className="w-full ">
                    <tbody className="text-xs">
                      <tr className="bg-accent-violet">
                        <td className="px-2">1-Name</td>
                        <td className="px-2">2-Name</td>
                        <td className="px-2">3-Name</td>
                      </tr>
                      <tr>
                        <td className="px-2">4-Name</td>
                        <td className="px-2">5-Name</td>
                        <td className="px-2">6-Name</td>
                      </tr>
                      <tr className="bg-accent-violet">
                        <td className="px-2">7-Name</td>
                        <td className="px-2">8-Name</td>
                        <td className="px-2">9-Name</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                </div>
              </div>

              <div className="w-full relative">
                <div className="bg-purple lg:w-40 h-40 rounded-lg my-5 bg-opacity-70">
                  <div className="shadow-inner-custom px-4 py-4 h-40 rounded-lg"></div>
                  </div>
                </div>
            </div>

            <div className="flex mx-2 flex-row gap-4 md:gap-6">
              <div className="w-full relative">
                <p><span className="text-2xl pl-4 font-audiowide absolute text-lilac mix-blend-difference">Matches history</span></p>
                  <div className="bg-purple text-normal h-80 rounded-md m-2 mt-5 mb-2 px-4 py-2 pt-4">

                    <div className="flex flex-row justify-content">
                      {/*COURBE*/}
                      <div className="w-full">
                      </div>
                      {/*MATCH RESUME*/}
                      <div className="w-full overflow-x-auto">
                        <table className="w-full ">
                          <tbody className="text-xs px-2">
                            <p className="text-dark-violet mb-2">today</p>
                            <tr className="text-lilac">
                              <td>5-1</td>
                              <td>Thonthon</td>
                              <td>Victory</td>
                              <td>6 bonus</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

              </div>
              </div>
            </div>
            </div>
        </div>

    </MainLayout>
  )
}

export default Dashboard