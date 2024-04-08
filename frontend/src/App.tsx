import { Routes as Router, Route, Navigate, useLocation } from 'react-router-dom';

import AuthLayout from './pages/_auth/AuthLayout';
import SigninForm from './pages/_auth/forms/SigninForm';
import SignupForm from './pages/_auth/forms/SignupForm';
import Dashboard from './pages/_root/Dashboard';
import Game from './pages/_game/Game';
import Chat from './pages/_chat/Chat';
import Friends from './pages/_friends/Friends';
import SetFriends from './pages/_friends/container/SetFriends';
import AccountSetting from './pages/_editProfile/container/AccountSetting';
import Settings from './pages/_editProfile/EditProfile';

import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import DashboardFriends from "./pages/_users/DashboardFriends";
import { WebSocketContext, socket } from "./socket/socket";
import { Websocket } from "./components/Websocket";
import AboutToPlay from "./pages/_game/container/AboutToPlay";
import SceneManager from "./game/SceneManager";
import SigninForm2Fa from "./pages/_auth/forms/SigninForm2Fa";
import PageNotFound from "./pages/_404/PageNotFound";
import { useEffect } from "react";

const App: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);

  const location = useLocation();

  useEffect(() => {
    if (
      !location.pathname.startsWith(`/gamestart/`) &&
      !location.pathname.startsWith("/test/")
    ) {
      console.log("destroyGame");
      socket.emit("destroyGame");
    }
  }, [location]);

  return (
    <WebSocketContext.Provider value={socket}>
      <Websocket />
      <Router>
        {/*public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-in-2fa" element={<SigninForm2Fa />} />
          <Route path="/sign-up" element={<SignupForm />} />
          <Route
            index
            element={user ? <Dashboard /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/user/:username"
            element={user ? <DashboardFriends /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/gamestart/:gameSocket"
            element={user ? <AboutToPlay /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/game"
            element={user ? <Game /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/test/:gameSocket"
            element={user ? <SceneManager /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/chat"
            element={user ? <Chat /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/chat/:chanId"
            element={user ? <Chat /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/friends"
            element={user ? <Friends /> : <Navigate to="/sign-in" />}
          >
            <Route
              path="/friends"
              element={user ? <SetFriends /> : <Navigate to="/sign-in" />}
            />
          </Route>
          <Route
            path="/settings"
            element={user ? <Settings /> : <Navigate to="/sign-in" />}
          >
            <Route
              path="/settings"
              element={user ? <AccountSetting /> : <Navigate to="/sign-in" />}
            />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Route>

        {/*private routes */}
      </Router>
    </WebSocketContext.Provider>
  );
};

export default App;
