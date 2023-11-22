import { useLocation } from "react-router-dom";
import MainLayout from "../../components/nav/MainLayout"
import { FaUser } from "react-icons/fa6";

const Dashboard = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  return (
    <MainLayout currentPage={currentPage}>
        <div className="flex-1 md:flex flex-row">
          {/*leftSideBar*/}
          <div className="grid grid-rows-[auto,1fr,auto] bg-purple-950  p-4 px-4 text-gray-400 rounded-l-lg">
            
            {/*User*/}
            <div className="flex mt-4">
              <div className="bg-purple-700	rounded-full p-2">
                <FaUser className="w-[66px] h-[66px] p-3 text-purple-500	"/>
              </div>
              <div className="pl-4 pt-4">
                <p className="text-xs text-purple-300">Member sinced 20/12/23</p>
                <p className="text-sm font-semibold text-purple-500">ClemCheyrou</p>
                <p className="mt-1 text-white text-xs font-medium text-purple-200"><span className="bg-purple-400 py-[0.15rem] px-[0.4rem] rounded">Legend</span></p>
              </div>
            </div>

            {/*Stats*/}
            <div className="flex flex-col justify-end mb-2">
              <div className="bg-white dark:text-gray-200 gap-2 mt-2 h-24 dark:bg-secondary-dark-bg w-full px-2 py-2 rounded-md ">
                <p className="text-sm text-purple-500">Total</p>
              </div>
              <div className="flex gap-4 mt-4 flex-row">
                  <div className="flex bg-white dark:text-gray-200 h-24 dark:bg-secondary-dark-bg w-full px-2 py-2 rounded-md ">
                    <p className="text-sm text-purple-500">Win</p>
                  </div>

                  <div className="flex bg-white dark:text-gray-200 h-24 dark:bg-secondary-dark-bg w-full px-2 py-2 rounded-md ">
                    <p className="text-sm text-purple-500">Loss</p>
                  </div>
              </div>
            </div>
          </div>

          {/*Dashboard*/}
          <div className="flex-1 bg-purple-950 bg-opacity-80 p-4 rounded-r-lg">

            <div className="flex m-2 flex-row gap-4 md:gap-6">

                <div className="bg-white dark:text-gray-200 h-40 dark:bg-secondary-dark-bg w-full lg:w-60 px-4 py-2  rounded-lg ">
                  <p><span className="text-sm text-purple-500">Data</span></p>
                  <p className="text-sm text-gray-400">Badges</p>

                </div>

                <div className="bg-white dark:text-gray-200 h-40 dark:bg-secondary-dark-bg w-full lg:w-40 px-4 py-2  rounded-lg ">
                <p><span className="text-sm text-purple-500">Data</span></p>
                  <p className="text-sm text-gray-400">Badges</p>
                </div>

            </div>

            <div className="flex flex-row m-2 mt-6 gap-4 md:gap-6">

              <div className="bg-white dark:text-gray-200 h-40 dark:bg-secondary-dark-bg w-full lg:w-40 px-4 py-2 rounded-lg ">
                <p><span className="text-sm text-purple-500">Data</span></p>
                <p className="text-sm text-gray-400">Podium</p>              
              </div>

              <div className="bg-white h-40 dark:text-gray-200 dark:bg-secondary-dark-bg w-full lg:w-60 px-4 py-2 rounded-lg hidden md:block">
                <p><span className="text-sm text-purple-500">Data</span></p>
                <p className="text-sm text-gray-400">Podium</p>
              </div>

              <div className="bg-white dark:text-gray-200 h-40 dark:bg-secondary-dark-bg w-full lg:w-40 px-4 py-2  rounded-lg ">
                <p><span className="text-sm text-purple-500">Data</span></p>
                <p className="text-sm text-gray-400">Top players</p>
              </div>
            </div>

              
            <div className="bg-white text-normal h-60 rounded-md m-2 mt-6 px-4 py-2 pt-4">
                <div>
                  <p className="text-sm text-purple-500">History</p>
                </div>
              </div>

            </div>
        </div>

    </MainLayout>
  )
}

export default Dashboard