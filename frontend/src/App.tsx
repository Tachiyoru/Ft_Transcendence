import { Routes as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import AuthLayout from './pages/_auth/AuthLayout';
import SigninForm from './pages/_auth/forms/SigninForm';
import SignupForm from './pages/_auth/forms/SignupForm';


import Dashboard from './pages/_root/Dashboard';

import ForgetPassword from './pages/_auth/forms/ForgetPassword';
import Game from './pages/_game/Game';
import Chat from './pages/_chat/Chat';
import AllFriends from './pages/_friends/container/AllFriends copy 2';
import Invitations from './pages/_friends/container/Invitations';
import BlockedFriends from './pages/_friends/container/BlockedFriends';

const App:React.FC = () => {  
  return (
		<Router>
		{/*public routes */}
		<Route element={<AuthLayout />}>
			<Route path="/sign-in" element={<SigninForm />} />
			<Route path="/sign-up" element={<SignupForm />} />
			<Route path="/forget-password" element={<ForgetPassword />} />
			<Route index element={<Dashboard />} />
			<Route path="/game" element={<Game />} />
			<Route path="/chat" element={<Chat />} />
			<Route path="/friends" element={<AllFriends />} />
			<Route path="/all_friends" element={<AllFriends/>} />
			<Route path="/invitations" element={<Invitations />} />
			<Route path="/blocked_friends" element={<BlockedFriends />} />
		</Route>

		{/*private routes */}
	</Router>
  )
}

export default App
