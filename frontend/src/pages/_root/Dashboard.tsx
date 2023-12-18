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

  function highlightMiddle(event) {
    const container = event.target;
    const options = container.childNodes;

    const scrollPosition = container.scrollTop;
    const middleIndex = Math.floor(options.length / 2);

    options.forEach((option, index) => {
      const distanceToMiddle = Math.abs(index - middleIndex);
      const paddingValue = middleIndex - distanceToMiddle > 0 ? (middleIndex - distanceToMiddle) * 5 : 0;

      option.style.paddingLeft = `${paddingValue}px`;

      if (index === middleIndex) {
        option.classList.add('highlight');
      } else {
        option.classList.remove('highlight');
      }
    });
  }
  
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
          <div className="md:w-[260px] md:rounded-l-lg bg-violet-black p-4 text-gray-300 text-xs">

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
									<div className="flex flex-row items-center bg-purple hover:bg-violet-black-nav p-2 pl-5 rounded-md text-lilac text-sm">
										<IoSettingsSharp className="w-3 h-4 mr-2"/>
										<p>Edit Profile</p>
									</div>
								</Link>
              </div>

              <div className="mt-60 mb-10">
                <div className='h-1 bg-white'>
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
              <div className="flex flex-col justify-end">
                <div className="bg-accent-violet font-kanit font-extrabold flex flex-row items-center p-4 font-audiowide mt-2 h-24 w-full rounded-md ">
                  <p className="text-5xl text-lilac">127</p>
                  <div className="pt-7 text-xl text-purple">
                    <p style={{ marginBottom: '-0.7rem' }}>matches</p>
                    <p>played</p>
                  </div>
                </div>
                <div className="flex mt-4 gap-4 flex-row">
                    <div className="font-kanit font-extrabold bg-accent-violet h-24 w-1/2 px-4 rounded-md">
                      <p className="text-4xl text-fushia" style={{ marginTop: '-0.7rem' }}>90</p>
                      <p className="text-xl text-purple" style={{ marginTop: '-1.5rem' }}>victories</p>
                    </div>

                    <div className="font-kanit font-extrabold bg-accent-violet h-24 w-1/2 px-4 rounded-md">
                      <p className="text-4xl text-violet-black" style={{ marginTop: '-0.7rem' }}>37</p>
                      <p className="text-xl text-purple" style={{ marginTop: '-1.5rem' }}>defeats</p>
                    </div>
                </div>
              </div>

          </div>

          {/*Dashboard*/}
          <div className="flex-1 bg-violet-black-nav bg-opacity-80 p-4 md:rounded-r-lg">

            <div className="flex mx-2 flex-row gap-4 md:gap-6">

              <div className="w-full lg:w-60 relative">
                <p><span className="text-2xl pl-2 font-audiowide absolute text-lilac my-4">Badges</span></p>
                <div className="lg:w-60 h-40 my-5 p-2 rounded-lg mt-12">
                <div className="flex flex-wrap">
                {[1, 2, 3, 4].map((badge) => (
                    <div
                        key={badge}
                        className="w-12 h-12 bg-fushia rounded-full m-1"
                    />
                ))}
        </div>

                </div>
              </div>

              <div className="sm:w-full relative lg:w-40">
                <p><span className="text-4xl pl-2 absolute font-kanit font-extrabold text-fushia mix-blend-difference" style={{ marginTop: '-0.7rem' }}>4</span></p>
                <div className="bg-purple lg:w-40 h-40 rounded-lg my-8 bg-opacity-80">
                  <div className="shadow-inner-custom px-4 py-4 h-40 rounded-lg">
                    <p className="text-2xl font-kanit font-extrabold text-fushia pt-4" style={{ lineHeight: '1.4rem' }}>matches <br/>played <br/>together</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex flex-row m-2 gap-4 md:gap-6">
            
              <div className="w-full relative lg:w-40">
              <div className="bg-purple lg:w-40 h-40 rounded-lg my-5 bg-opacity-80">
                  <div className="shadow-inner-custom px-4 h-40 rounded-lg">
                  <div className="line-container">
                    <div className="colorful-line" style={{ "--i": 4 }}></div>
                    <div className="colorful-line" style={{ "--i": 8 }}></div>
                    <div className="colorful-line" style={{ "--i": 1 }}></div>
                    <div className="colorful-line" style={{ "--i": 3 }}></div>
                    <div className="colorful-line" style={{ "--i": 7 }}></div>
                    <div className="colorful-line" style={{ "--i": 2 }}></div>
                    <div className="colorful-line" style={{ "--i": 5 }}></div>
                    <div className="colorful-line" style={{ "--i": 6 }}></div>
                  </div>
                  </div>
                </div>
              </div>

              <div className="w-full relative lg:w-60 ">
              <p><span className="text-2xl pl-2 font-audiowide absolute text-lilac my-4" style={{ marginTop: '0rem' }}>Leaderboards</span></p>
                <div className="bg-purple lg:w-60 h-40 my-5 py-4 rounded-lg ">
                <p><span className="text-xl pl-2 font-kanit font-extrabold text-fushia">Friends</span></p>
                  <div className="overflow-x-auto">
                  <table className="w-full text-lilac">
                    <tbody className="text-xs">
                      <tr className="bg-accent-violet">
                        <td className="px-2">1-</td>
                        <td className="px-2">2-</td>
                        <td className="px-2">3-</td>
                      </tr>
                      <tr>
                        <td className="px-2">4-</td>
                        <td className="px-2">5-</td>
                        <td className="px-2">6-</td>
                      </tr>
                      <tr className="bg-accent-violet">
                        <td className="px-2">7-</td>
                        <td className="px-2">8-</td>
                        <td className="px-2">9-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                </div>
                <div className="flex flex-wrap absolute text-lilac right-2 bottom-2">
                {[1, 2, 3].map((badge) => (
                    <div
                        key={badge}
                        className="w-6 h-6 bg-fushia rounded-full ml-1 mix-blend-difference"
                    />
                ))}
                </div>
              </div>

              <div className="w-full relative">
                <div className="bg-purple lg:w-40 h-40 rounded-lg my-5 bg-opacity-70">
                  <div className="shadow-inner-custom px-4 py-4 h-40 rounded-lg">
                  <div className="h-20 py-2 overflow-y-scroll" onScroll={highlightMiddle}>
                    <div className="px-4 text-xs text-lilac" style={{ marginTop: '-0.14rem' }}>1-Clem</div>
                    <div className="px-4 text-xs text-lilac" style={{ marginTop: '-0.14rem' }}>2-Shanley</div>
                    <div className="px-4 text-xs text-lilac" style={{ marginTop: '-0.14rem' }}>3-Manuel</div>
                    <div className="px-4 text-xs text-lilac" style={{ marginTop: '-0.14rem' }}>4-Anne</div>
                    <div className="px-4 text-xs text-lilac" style={{ marginTop: '-0.14rem' }}>5-Alex</div>
                    <div className="px-4 text-xs text-lilac" style={{ marginTop: '-0.14rem' }}>6-Pat</div>
                    <div className="px-4 text-xs text-lilac" style={{ marginTop: '-0.14rem' }}>7-Gus</div>
                    </div>
                  </div>
                  </div>
                </div>
            </div>

            <div className="flex mx-2 flex-row gap-4 md:gap-6">
              <div className="w-full relative">
                <p><span className="text-2xl pl-4 font-audiowide absolute text-lilac">Matches history</span></p>
                  <div className="bg-violet-black text-normal h-80 rounded-md m-2 mt-5 mb-2 px-4 py-2 pt-4">

                    <div className="flex flex-col justify-content mt-4">
                      {/*MATCH RESUME*/}
                      <div className="w-full overflow-x-auto">
                        <table className="w-full">
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