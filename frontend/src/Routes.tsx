import { useContext } from 'react';
import { Routes as Router, Route, Navigate, Outlet } from 'react-router-dom';

import AuthLayout from './pages/_auth/AuthLayout';
import SigninForm from './pages/_auth/forms/SigninForm';
import SignupForm from './pages/_auth/forms/SignupForm';


import Dashboard from './pages/_root/Dashboard';
import Profil from './pages/_root/container/Profil';

import ForgetPassword from './pages/_auth/forms/ForgetPassword';
import { AuthContext } from './context/AuthContext';
import Game from './pages/_game/Game';
import Chat from './pages/_chat/Chat';
import Friends from './pages/_friends/Friends';

const PrivateRoutes = () => {
	const { authenticated } = useContext(AuthContext);

	if (authenticated === null) {
		return <Navigate to='/sign-up' replace/>
	}

	return <Outlet />
}

const Routes = () => {

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
			<Route path="/friends" element={<Friends />} />
		</Route>

		{/*private routes */}
		<Route element={<PrivateRoutes />}>
			<Route index element={<Dashboard />} />
			<Route path="/profil" element={<Profil />} />
		</Route>
	</Router>
	)
}

export default Routes