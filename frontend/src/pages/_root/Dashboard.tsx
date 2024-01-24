import MainLayout from "../../components/nav/MainLayout";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDashboardState } from "../../state/stateManagement";
import Sidebar from "./container/SideBar";
import Badges from "./container/Badges";
import Animation from "./container/Animation";
import Leaderboard from "./container/Leaderboard";
import History from "./container/History";
import { fetchDataUser } from "../../api/apiCalls";

const Dashboard = () => {
  const {
    userData,
    setUserData,
    userStats,
    setUserStats,
    userRankingGlobal,
    setUserRankingGlobal,
    userRankingFriends,
    setUserRankingFriends,
    userAchievements,
    setUserAchievements,
    loading,
    setLoading,
  } = useDashboardState();

  const location = useLocation();
  const currentPage = location.pathname;

  useEffect(() => {
    fetchDataUser({
      setUserData,
      setUserStats,
      setUserRankingGlobal,
      setUserRankingFriends,
      setUserAchievements,
      setLoading,
    });
  }, [
    setUserData,
    setUserStats,
    setUserRankingGlobal,
    setUserRankingFriends,
    setUserAchievements,
    setLoading,
  ]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Error loading user data</div>;
  }

  return (
    <MainLayout currentPage={currentPage}>
      <div className="flex flex-row">
        {/*leftSideBar*/}
        <Sidebar userData={userData} userStats={userStats} />

        {/*Dashboard*/}
        <div className="flex-1 bg-violet-black-nav bg-opacity-80 p-4 md:rounded-r-lg">
          <div className="flex mx-2 flex-row gap-4 md:gap-6">
            <Badges userAchievements={userAchievements} />
          </div>
          <div className="flex flex-row m-2 gap-4 md:gap-6">
            <Animation />
            <Leaderboard
              userRankingFriends={userRankingFriends}
              userRankingGlobal={userRankingGlobal}
            />
          </div>
          <History />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
