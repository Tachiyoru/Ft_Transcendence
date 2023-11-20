import { useLocation } from "react-router-dom";
import MainLayout from "../../components/nav/MainLayout"
import { FaUser } from "react-icons/fa6";

const Dashboard = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  return (
    <MainLayout currentPage={currentPage}>
        <div className="flex w-full h-40rem sm:h-60rem">
          {/*leftSideBar*/}
          <div className="w-3/12 lg:w-3/12 bg-gray-200 p-4 px-4 text-gray-400">
            
            {/*User*/}
            <div className="flex m-1 mt-4">
              <FaUser className="w-12 h-12 p-3 bg-white rounded-lg"/>
              <div className="pl-2">
                <p className="text-xs">Member sinced 20/12/23</p>
                <p className="text-sm">Ccheyrou</p>
                <p className="bg-gray-300 text-white text-xs rounded py-0.2 text-center">Legend</p>
              </div>
            </div>

            {/*Stats*/}
            <div className="flex gap-2 mt-4 lg:flex-row md:flex-row sm:flex-col">
                <div className="flex bg-white dark:text-gray-200 h-16 dark:bg-secondary-dark-bg w-full px-2 py-2 rounded-md ">
                  <p className="text-sm">Win</p>
                </div>

                <div className="flex bg-white dark:text-gray-200 h-16 dark:bg-secondary-dark-bg w-full px-2 py-2 rounded-md ">
                  <p className="text-sm">Loss</p>
                </div>
            </div>
            <div className="bg-white dark:text-gray-200 gap-2 mt-2 h-20 dark:bg-secondary-dark-bg w-full px-2 py-2 rounded-md ">
              <p className="text-sm">Loss</p>
            </div>
          </div>

          {/*Dashboard*/}
          <div className="w-9/12 lg:w-10/12 bg-gray-300 p-4 ">

            <div className="flex m-2 flex-wrap gap-2">

                <div className="bg-white dark:text-gray-200 h-24 dark:bg-secondary-dark-bg w-60 px-4 py-2  rounded-lg ">
                  <p><span className="text-sm">Data</span></p>
                  <p className="text-sm text-gray-400">Badges</p>

                </div>

                <div className="bg-white dark:text-gray-200 h-24 dark:bg-secondary-dark-bg w-28 px-4 py-2  rounded-lg ">
                <p><span className="text-sm">Data</span></p>
                  <p className="text-sm text-gray-400">Badges</p>
                </div>

            </div>

            <div className="flex m-2 mt-2 flex-wrap gap-2">

              <div className="bg-white dark:text-gray-200 h-24 dark:bg-secondary-dark-bg w-28 px-4 py-2 rounded-lg ">
                <p><span className="text-sm">Data</span></p>
                <p className="text-sm text-gray-400">Podium</p>              
              </div>

              <div className="bg-white h-24 dark:text-gray-200 dark:bg-secondary-dark-bg w-60 px-4 py-2 rounded-lg ">
                <p><span className="text-sm">Data</span></p>
                <p className="text-sm text-gray-400">Podium</p>
              </div>

              <div className="bg-white dark:text-gray-200 h-24 dark:bg-secondary-dark-bg w-28 px-4 py-2  rounded-lg ">
                <p><span className="text-sm">Data</span></p>
                <p className="text-sm text-gray-400">Top players</p>
              </div>
            </div>

              
            <div className="bg-white text-normal h-40 rounded-md m-2 mt-2 px-4 py-2  pt-4">
                <div>
                  <p className="text-sm text-gray-400">History</p>
                </div>
              </div>
            </div>

        </div>

    </MainLayout>
  )
}

export default Dashboard