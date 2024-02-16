import MainLayout from "../../components/nav/MainLayout";
import { useLocation } from "react-router-dom";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import SidebarLeft from "./container/SidebaLeft";
import ContentConv from "./container/ContentConv";
import { WebSocketContext } from "../../socket/socket";

const Chat = () => {
  const location = useLocation();
  const currentPage = location.pathname;
  const [isTyping, setIsTyping] = useState(false);
  const socket = useContext(WebSocketContext);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setIsTyping(inputValue !== "");
  };

  useEffect(() => {
		socket.emit("notInGame");
	}, []);
  
  return (
    <MainLayout currentPage={currentPage}>
      <div className="flex flex-row h-[80vh] relative overflow-hidden" style={{ cursor: "default" }}>
        {/*LEFT SIDE BAR*/}
        <SidebarLeft
          handleInputChange={handleInputChange}
          isTyping={isTyping}
        />

        {/*MIDDLE*/}
        <ContentConv />

      </div>
    </MainLayout>
  );
};

export default Chat;
