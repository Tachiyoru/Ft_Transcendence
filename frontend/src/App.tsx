import { Routes, Route } from 'react-router-dom';

import AuthLayout from './_auth/AuthLayout';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';

import { Home } from './_root/pages';
import RootLayout from './_root/RootLayout';
import ForgetPassword from './_auth/forms/ForgetPassword';

function App() {
  return (
    <main className='flex h-screen'>
      <Routes>

        {/*public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
        </Route>

        {/*private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>

      </Routes>
      
    </main>
  )
}

export default App
