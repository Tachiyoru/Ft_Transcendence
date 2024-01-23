import { Link } from "react-router-dom";
import DateConverter from "../../../components/date/DateConverter";
import { FaUser } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";

interface UserData {
  username: string;
  avatar: string;
  tittle: string;
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
    <div className="md:w-[260px] md:rounded-l-lg bg-violet-black p-4 text-xs">
      <div className="flex mt-4 mb-10 m-2">
        {userData.avatar ? (
          <img
            src={userData.avatar}
            className="h-20 w-20 object-cover rounded-full text-lilac"
            alt="User Avatar"
          />
        ) : (
          <div className="bg-purple rounded-full p-2 mt-2">
            <FaUser className="w-[60px] h-[60px] p-3 text-lilac" />
          </div>
        )}
        <div className="pl-4 pt-4">
          <DateConverter initialDate={userData.createdAt} />
          <p className="text-sm font-semibold text-lilac">
            {userData.username}
          </p>
          <p className="mt-2 text-xs font-medium text-white">
            <span className="bg-lilac py-[0.15rem] px-[0.4rem] rounded">
              {userData.tittle}
            </span>
          </p>
        </div>
      </div>

      <div>
        <Link to="/settings">
          <div className="flex flex-row items-center bg-purple hover:bg-violet-black-nav p-2 pl-5 rounded-md text-lilac text-sm">
            <IoSettingsSharp className="w-3 h-4 mr-2" />
            <p>Edit Profile</p>
          </div>
        </Link>
      </div>

      <div className="mt-60 mb-10">
        <div className="h-1 bg-white">
          <div
            style={{ width: userStats.exp }}
            className="h-full bg-purple"
          ></div>
        </div>
        <div className="flex flex-row justify-between mt-2 text-sm text-lilac">
          <span>Level {userStats.lvl}</span>
          <span>{userStats.exp}/400</span>
        </div>
      </div>

      {/*Stats*/}
      <div className="flex flex-col justify-end">
        <div className="bg-accent-violet font-kanit font-extrabold flex flex-row items-center p-4 mt-2 h-24 w-full rounded-md ">
          <p className="text-5xl text-lilac">{userStats.partyPlayed}</p>
          <div className="pt-7 text-xl text-purple ml-2">
            <p style={{ marginBottom: "-0.7rem" }}>matches</p>
            <p>played</p>
          </div>
        </div>
        <div className="flex mt-4 gap-4 flex-row">
          <div className="font-kanit font-extrabold bg-accent-violet h-24 w-1/2 px-4 rounded-md">
            <p
              className="text-4xl text-fushia"
              style={{ marginTop: "-0.7rem" }}
            >
              {userStats.partyWon}
            </p>
            <p className="text-xl text-purple" style={{ marginTop: "-1.5rem" }}>
              victories
            </p>
          </div>

          <div className="font-kanit font-extrabold bg-accent-violet h-24 w-1/2 px-4 rounded-md">
            <p
              className="text-4xl text-violet-black"
              style={{ marginTop: "-0.7rem" }}
            >
              {userStats.partyLost}
            </p>
            <p className="text-xl text-purple" style={{ marginTop: "-1.5rem" }}>
              defeats
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
