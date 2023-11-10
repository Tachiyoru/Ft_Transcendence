import { useContext } from 'react';
import { Routes as Router, Route, Navigate, Outlet } from 'react-router-dom';

import AuthLayout from './_auth/AuthLayout';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';


import RootLayout from './_root/RootLayout';
import Profil from './_root/pages/Profil';

import ForgetPassword from './_auth/forms/ForgetPassword';
import { AuthContext } from './context/AuthContext';

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
		</Route>

		{/*private routes */}
		<Route element={<PrivateRoutes />}>
			<Route index element={<RootLayout />} />
			<Route path="/profil" element={<Profil />} />
		</Route>
	</Router>
	)
}

export default Routes