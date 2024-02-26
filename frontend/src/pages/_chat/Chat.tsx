import MainLayout from "../../components/nav/MainLayout";
import { useLocation } from "react-router-dom";
import { useContext, useEffect} from "react";
import SidebarLeft from "./container/SidebaLeft";
import ContentConv from "./container/ContentConv";
import { WebSocketContext } from "../../socket/socket";

const Chat = () => {
  const location = useLocation();
  const currentPage = location.pathname;
  const socket = useContext(WebSocketContext);


  useEffect(() => {
		socket.emit("notInGame");
    socket.emit('updateStatusUser')
	}, []);
  
  return (
    <MainLayout currentPage={currentPage}>
      <div className="flex flex-row h-[80vh] relative overflow-hidden" style={{ cursor: "default" }}>
        {/*LEFT SIDE BAR*/}
        <SidebarLeft/>

        {/*MIDDLE*/}
        <ContentConv />

      </div>
    </MainLayout>
  );
};

export default Chat;
