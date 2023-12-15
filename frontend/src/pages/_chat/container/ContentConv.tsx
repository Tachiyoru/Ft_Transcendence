import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaBan, FaPaperPlane, FaUserGroup, FaXmark } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { RiGamepadFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const ContentConv = () => {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-dark-violet text-gray-300 text-xs relative p-8">
      {/*NAME*/}
      <div>
        <div className="flex flex-row justify-between">
          <h3 className="text-base text-lilac">Name</h3>
          <button className="lg:hidden flex-end" onClick={toggleRightSidebar}>
            <FaUserGroup className="w-4 h-4 text-lilac" />
          </button>
        </div>
        {/*CONTENT*/}
        <div className="flex flex-row h-12 mt-6">
          <div className="w-[45px] h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center mr-4">
            <FaUser className="text-lilac" />
          </div>
          <div className="pt-3">
            <p className="text-base text-lilac">Name</p>
            <div className="flex flex-row">
              <p className="text-sm  pt-1 text-lilac text-opacity-60 mr-2">
                Lorem ipsum dolor…
              </p>
              <p className="text-sm pt-1 text-lilac text-opacity-60">12:00</p>
            </div>
          </div>
        </div>
      </div>

      {/*SEND*/}
      <div>
        <div className="flex items-center relative">
          <input className="py-2 bg-lilac w-full rounded-md" />
          <span className="absolute right-4">
            <FaPaperPlane className="w-3 h-3 text-violet-dark" />
          </span>
        </div>
      </div>
      <div
        className={`absolute h-[80vh] top-0 right-0 w-[260px] md:rounded-r-lg bg-violet-black p-4 text-gray-300 text-xs ${
          isRightSidebarOpen ? "block" : "hidden"
        }`}
      >
        {/*CLOSE*/}
        <button className="lg:hidden flex-end" onClick={toggleRightSidebar}>
          <FaXmark className="w-4 h-4 text-lilac" />
        </button>

        {/*TEST USER FRIEND*/}
        <div className="flex flex-col items-center">
          <div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
            <FaUser className="w-[30px] h-[30px] text-lilac" />
          </div>
          <p className="text-sm text-lilac pt-2">Name</p>
        </div>

        {/*NAV PERSONNAL CONV*/}
        <nav className="mt-4">
          <ul className="text-lilac">
            <li>
              <Link to="/settings">
                <div className="flex flex-row items-center">
                  <FaUser className="w-3 h-4 mr-2" />
                  <p className="hover:underline">See Profile</p>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/settings">
                <div className="flex flex-row items-center">
                  <RiGamepadFill className="w-3 h-4 mr-2" />
                  <p className="hover:underline">Invite to play</p>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/settings">
                <div className="flex flex-row items-center">
                  <FaBan className="w-3 h-4 mr-2" />
                  <p className="hover:underline">Block</p>
                </div>
              </Link>
            </li>
          </ul>
        </nav>

        {/*NAV PERSONNAL CONV*/}
        <div className="flex flex-col justify-end space-y-2 px-2 py-2 mt-4 rounded-lg bg-purple">
          <div className="flex flex-row justify-between items-center">
            <div className="text-xs text-lilac">Invite friends</div>
            <IoIosArrowForward className="w-2 h-2 text-lilac" />
          </div>
          <div className="border-t border-lilac"></div>
          <div className="flex flex-row justify-between items-center">
            <div className="text-xs text-lilac">Random player</div>
            <IoIosArrowForward className="w-2 h-2 text-lilac" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentConv;
