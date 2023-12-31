import { Routes as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import AuthLayout from './pages/_auth/AuthLayout';
import SigninForm from './pages/_auth/forms/SigninForm';
import SignupForm from './pages/_auth/forms/SignupForm';
import Dashboard from './pages/_root/Dashboard';
import ForgetPassword from './pages/_auth/forms/ForgetPassword';
import Game from './pages/_game/Game';
import Chat from './pages/_chat/Chat';
import Friends from './pages/_friends/Friends';
import SetFriends from './pages/_friends/container/SetFriends';
import AccountSetting from './pages/_editProfile/container/AccountSetting';
import Settings from './pages/_editProfile/EditProfile';

import { useSelector } from "react-redux";
import { RootState } from './store/store';
import DashboardFriends from './pages/_users/DashboardFriends';

//import socketIO from 'socket.io-client';

//const socket = socketIO.connect('http://localhost:5001');

const App:React.FC = () => {  

const {user} = useSelector((state: RootState) => state.user)

return (
		<Router>
		{/*public routes */}
		<Route element={<AuthLayout />}>
			<Route path="/sign-in" element={<SigninForm />} />
			<Route path="/sign-up" element={<SignupForm />} />
			<Route path="/forget-password" element={<ForgetPassword />} />
			<Route index element={<Dashboard/>}/>
			<Route path="/user/:userId" element={<DashboardFriends/>}/>
			<Route path="/game" element={user ? <Game /> : <Navigate to="/sign-in" />} />
			<Route path="/chat" element={user ? <Chat /> : <Navigate to="/sign-in" />} />
			<Route path="/friends" element={user ? <Friends /> : <Navigate to="/sign-in" />}>
				<Route path="/friends" element={user ? <SetFriends /> : <Navigate to="/sign-in" />}/>
			</Route>
			<Route path="/settings" element={user ? <Settings /> : <Navigate to="/sign-in" />}>			
				<Route path="/settings" element={user ? <AccountSetting /> : <Navigate to="/sign-in" />}/>
			</Route>			
			
		</Route>

		{/*private routes */}
	</Router>
  )
}

export default App
