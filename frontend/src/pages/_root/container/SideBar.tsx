import { Link } from "react-router-dom";
import DateConverter from "../../../components/date/DateConverter";
import { FaUser } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";

interface UserData {
  username: string;
  avatar: string;
  title: string;
  createdAt: string;
}

interface UserStats {
  partyPlayed: number;
  partyWon: number;
  partyLost: number;
  lvl: number;
  exp: number;
}

interface SidebarProps {
  userData: UserData;
  userStats: UserStats;
}

const Sidebar: React.FC<SidebarProps> = ({ userData, userStats }) => {
  return (
    <div className="w-[66px] md:w-[260px] lg:w-[260px] md:rounded-l-lg bg-violet-black p-2 md:p-4 text-xs">
      <div className="flex mt-4 mb-10 m-0 md:m-2">
        {userData.avatar ? (
          <img
            src={userData.avatar}
            className="h-[48px] w-[48px] md:h-20 md:w-20 object-cover rounded-full text-lilac"
            alt="User Avatar"
          />
        ) : (
          <div className="bg-purple rounded-full p-2 mt-2">
            <FaUser className="w-[60px] h-[60px] p-3 text-lilac" />
          </div>
        )}
        <div className="pl-4 pt-4 md:block hidden">
          <DateConverter initialDate={userData.createdAt} />
          <p className="text-sm font-semibold text-lilac">
            {userData.username}
          </p>
          <p className="mt-2 text-xs font-medium text-white">
            <span className="bg-lilac py-[0.15rem] px-[0.4rem] rounded">
              {userData.title}
            </span>
          </p>
        </div>
      </div>

      <div>
        <Link to="/settings">
          <div className="flex flex-row items-center bg-purple hover:bg-violet-black-nav p-2 pl-5 rounded-md text-lilac text-sm">
            <IoSettingsSharp className="w-3 h-4 mr-2" />
            <p className="md:block hidden">Edit Profile</p>
          </div>
        </Link>
      </div>

      <div className="mt-60 mb-10">
        <div className="h-1 bg-lilac">
          <div
            style={{ width: userStats.exp }}
            className="h-full bg-purple"
          ></div>
        </div>
        <div className="flex flex-row justify-between mt-2 text-sm text-lilac">
          <span className="sm:block hidden">Level {userStats.lvl}</span>
          <span>{userStats.exp}/100</span>
        </div>
      </div>

      {/*Stats*/}
      <div className="flex flex-col justify-end">
        <div className="bg-accent-violet font-kanit font-extrabold flex flex-col md:flex-row md:items-center p-1 md:p-4 mt-2 h-16 md:h-24 w-full rounded-md ">
          <p className="text-xl md:text-5xl text-lilac">{userStats.partyPlayed}</p>
          <div className="pt-0 md:pt-7 text-sm md:text-xl text-purple ml-0 md:ml-2">
            <p style={{ marginBottom: window.innerWidth > 800 ? "-0.7rem" : "-0.5rem" }}>matches</p>
            <p>played</p>
          </div>
        </div>
        <div className="flex mt-4 gap-4 flex-col md:flex-row">
          <div className="font-kanit font-extrabold bg-accent-violet h-16 md:h-24 w-full md:w-1/2 px-1 md:px-4 rounded-md">
            <p
              className="text-xl md:text-4xl text-fushia"
              style={{ marginBottom: window.innerWidth > 800 ? "-0.7" : "1.5rem" }}
            >
              {userStats.partyWon}
            </p>
            <p className="text-sm md:text-xl text-purple" style={{ marginTop: "-1.5rem" }}>
              victories
            </p>
          </div>

          <div className="font-kanit font-extrabold bg-accent-violet h-16 md:h-24 w-full md:w-1/2 px-1 md:px-4 rounded-md">
            <p
              className="text-xl md:text-4xl text-violet-black"
              style={{ marginBottom: window.innerWidth > 800 ? "-0.7rem" : "1.5rem" }}
            >
              {userStats.partyLost}
            </p>
            <p className="text-sm md:text-xl text-purple" style={{ marginTop: "-1.5rem" }}>
              defeats
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
