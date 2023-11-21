import { useState, ChangeEvent, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineCheck,
} from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import UserNameField from '../fields/UserNameField';
import EmailField from '../fields/EmailField';
import SocialIcons from '../fields/SocialIcons';
import AuthContext from '../../../context/AuthContext';


interface IdataRegister {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupForm = () => {

  const [resStatus, setResStatus] = useState('');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(false);

  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [passwordHasContent, setPasswordHasContent] = useState(false);
  const [confirmPasswordHasContent, setConfirmPasswordHasContent] =
    useState(false);
  const [showUsernameErrors, setShowUsernameErrors] = useState(false);
  const passwordHasLowercaseLetter = /[a-z]/.test(password);
  const passwordHasUppercaseLetter = /[A-Z]/.test(password);
  const passwordHasSpecialCharacter =
    /[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?]/.test(password);
  const passwordHasNumber = /[0-9]/.test(password);
  const passwordHasValidLength = password.length >= 6;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IdataRegister>();
//https://www.learmoreseekmore.com/2022/10/reactjs-v18-jwtauthentication-using-httponly-cookie.html

  const { signup } = useContext(AuthContext);
  
  const submitHandler = async (data: IdataRegister) => {
    await signup(data);
  };

  console.log(resStatus);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.currentTarget.value;
    setPassword(newPassword);
    setPasswordHasContent(newPassword.length > 0);
    setShowUsernameErrors(true);
  };

  const handleConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    const confirmPasswordValue = e.currentTarget.value;
    setConfirmPassword(confirmPasswordValue === password);
    setConfirmPasswordHasContent(confirmPasswordValue.length > 0);
  };

  const handleGoogleClick = () => {
    navigate('/42API');
  };

  const handle42Click = () => {
    navigate('/42API');
  };

  return (
    <div>
      <section className="container mx-auto px-5 py-10">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-2xl text-center mb-8">Create an Account</h1>
          <form onSubmit={handleSubmit(submitHandler)}>
            {/*Form name*/}
            <UserNameField
              register={register}
              errors={errors}
              showUsernameErrors={showUsernameErrors}
              resStatus={resStatus}
              setShowUsernameErrors={setShowUsernameErrors}
            />

            {/*Form Email*/}
            <EmailField
              register={register}
              errors={errors}
              showUsernameErrors={showUsernameErrors}
              resStatus={resStatus}
              setShowUsernameErrors={setShowUsernameErrors}
            />

            {/*Form Password*/}
            <div className="mb-4 w-full">
              <div className="flex flex-row items-center border-b">
                <AiOutlineLock className="w-4 h-4" />
                <input
                  type={passwordIsVisible ? 'text' : 'password'}
                  id="password"
                  {...register('password', {
                    required: {
                      value: true,
                      message: 'Password is required',
                    },
                    minLength: {
                      value: 6,
                      message: 'Password length must be at least 6 characters',
                    },
                  })}
                  placeholder="Enter Password"
                  className="px-5 py-4 w-full outline-none"
                  onChange={handlePasswordChange}
                />
                <button
                  onClick={() => {
                    setPasswordIsVisible((prevState) => !prevState);
                    setShowUsernameErrors(false);
                  }}
                >
                  {passwordIsVisible ? (
                    <AiOutlineEyeInvisible className="w-4 h-4" />
                  ) : (
                    <AiOutlineEye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {passwordHasContent && (
                <ul>
                  <li
                    className="flex align-items text-xs mt-4"
                    style={{
                      color: passwordHasLowercaseLetter ? 'green' : 'red',
                    }}
                  >
                    <AiOutlineCheck className="mt-0.5 mr-2" />
                    One lower letter
                  </li>
                  <li
                    className="flex align-items text-xs"
                    style={{
                      color: passwordHasUppercaseLetter ? 'green' : 'red',
                    }}
                  >
                    <AiOutlineCheck className="mt-0.5 mr-2" />
                    One uppercase letter
                  </li>
                  <li
                    className="flex align-items text-xs"
                    style={{
                      color:
                        passwordHasSpecialCharacter || passwordHasNumber
                          ? 'green'
                          : 'red',
                    }}
                  >
                    <AiOutlineCheck className="mt-0.5 mr-2" />
                    One number or special character
                  </li>
                  <li
                    className="flex align-items text-xs"
                    style={{ color: passwordHasValidLength ? 'green' : 'red' }}
                  >
                    <AiOutlineCheck className="mt-0.5 mr-2" />
                    Minimum 6 characters
                  </li>
                </ul>
              )}

              {showUsernameErrors && errors.password?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password?.message}
                </p>
              )}
            </div>

            <div className="mb-6 w-full">
              <div className="flex flex-row items-center border-b">
                <AiOutlineLock className="w-4 h-4" />
                <input
                  type={passwordIsVisible ? 'text' : 'password'}
                  id="confirmPassword"
                  {...register('confirmPassword', {
                    required: {
                      value: true,
                      message: 'Confirm Password is required',
                    },
                  })}
                  placeholder="Confirm Password"
                  className="px-5 py-4 w-full outline-none"
                  onChange={handleConfirmPassword}
                />
                <button
                  onClick={() => {
                    setPasswordIsVisible((prevState) => !prevState);
                    setShowUsernameErrors(false);
                  }}
                >
                  {passwordIsVisible ? (
                    <AiOutlineEyeInvisible className="w-4 h-4" />
                  ) : (
                    <AiOutlineEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {confirmPasswordHasContent && (
                <ul>
                  <li
                    className="flex align-items text-xs mt-4"
                    style={{ color: confirmPassword ? 'green' : 'red' }}
                  >
                    <AiOutlineCheck className="mt-0.5 mr-2" />
                    Confirm password
                  </li>
                </ul>
              )}

              {showUsernameErrors && errors.password?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password?.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || !confirmPassword}
              className="border bg-gray-200 py-2 px-10 w-full rounded mb-6 disabled:opacity-40"
            >
              Create an account
            </button>

            <p className="text-sm text-center mb-8">
              You have an account?{' '}
              <Link to="/sign-in" className="underline">
                Login now
              </Link>
            </p>

            <div className="flex items-center mb-2 ">
              <div className="border-t flex-grow border-gray-300"></div>
              <span className="mx-4 text-sm text-gray-500">OR</span>
              <div className="border-t flex-grow border-gray-300"></div>
            </div>

            {/*Social Sign*/}
            <SocialIcons
              onGoogleClick={handleGoogleClick}
              on42Click={handle42Click}
            />
          </form>
        </div>
      </section>
    </div>
  );
};

export default SignupForm;
