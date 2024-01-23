import { useState, ChangeEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineCheck,
} from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import axios from '../../../axios/api';
import UserNameField from '../fields/UserNameField';
import EmailField from '../fields/EmailField';
import SocialIcons from '../fields/SocialIcons';

import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../services/UserSlice';

interface IdataRegister {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [resStatus, setResStatus] = useState('');

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
  
  const  SubmitHandler = async (data: IdataRegister) => {
      await axios
      .post('/auth/signup', data)
      .then((response) => {
        if (response.status === 201) {
          setResStatus('Successful Registration!');
          console.log(response.data);
          dispatch(loginSuccess(response.data))
		//   axios.post('/add/achievement', {id:1})
          navigate('/');
        } else {
          setResStatus('Error');
        }
      })
      .catch(function (error) {
        setResStatus('Error');
        console.log(error.response.data.message);
      });
	  const response = await axios.post(`achievements/add/${1}`);
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


  const handle42Click = async () => {
    try{
      const response = window.location.href = "http://localhost:5001/auth/42/callback";
      if (response)
      {
        dispatch(loginSuccess(response))
      }
    } catch {
      setResStatus('Error');
    }
  };

  const handleGitClick = async () => {
    try{
      const response = window.location.href = "http://localhost:5001/auth/github/callback";
      if (response)
      {
        dispatch(loginSuccess(response))
      }
    } catch {
      setResStatus('Error');
    }
  };

  return (
    <div className='bg-violet-black-nav min-h-screen flex justify-center items-center'>
      <section className="w-full max-w-sm border-container">
        <div className="mx-auto px-16 py-10">
          <h1 className="text-xl font-audiowide font-outline-2 text-white text-center mb-8">SIGN UP</h1>
          <form onSubmit={handleSubmit(SubmitHandler)}>
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
            <div className="mb-2 w-full">
              <div className="flex flex-row items-center border-b border-lilac">
                <AiOutlineLock className="w-4 h-4 text-lilac" />
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
                  className="px-5 py-4 w-full text-lilac text-sm placeholder-lilac placeholder-opacity-40 bg-transparent outline-none"
                  onChange={handlePasswordChange}
                />
                <button
                  onClick={() => {
                    setPasswordIsVisible((prevState) => !prevState);
                    setShowUsernameErrors(false);
                  }}
                >
                  {passwordIsVisible ? (
                    <AiOutlineEyeInvisible className="w-4 h-4 text-lilac" />
                  ) : (
                    <AiOutlineEye className="w-4 h-4 text-lilac" />
                  )}
                </button>
              </div>

              {passwordHasContent && (
                <ul>
                  <li
                    className="flex align-items text-xs mt-4"
                    style={{
                      color: passwordHasLowercaseLetter ? '#D8F828' : '#FF4501',
                    }}
                  >
                    <AiOutlineCheck className="mt-0.5 mr-2" />
                    One lower letter
                  </li>
                  <li
                    className="flex align-items text-xs"
                    style={{
                      color: passwordHasUppercaseLetter ? '#D8F828' : '#FF4501',
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
                          ? '#D8F828'
                          : '#FF4501',
                    }}
                  >
                    <AiOutlineCheck className="mt-0.5 mr-2" />
                    One number or special character
                  </li>
                  <li
                    className="flex align-items text-xs"
                    style={{ color: passwordHasValidLength ? '#D8F828' : '#FF4501' }}
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

            <div className="mb-10 w-full">
              <div className="flex flex-row items-center border-lilac border-b">
                <AiOutlineLock className="w-4 h-4 text-lilac" />
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
                  className="px-5 py-4 w-full text-sm text-lilac placeholder-lilac placeholder-opacity-40 bg-transparent outline-none"
                  onChange={handleConfirmPassword}
                />
                <button
                  onClick={() => {
                    setPasswordIsVisible((prevState) => !prevState);
                    setShowUsernameErrors(false);
                  }}
                >
                  {passwordIsVisible ? (
                    <AiOutlineEyeInvisible className="w-4 h-4 text-lilac" />
                  ) : (
                    <AiOutlineEye className="w-4 h-4 text-lilac" />
                  )}
                </button>
              </div>
              {confirmPasswordHasContent && (
                <ul>
                  <li
                    className="flex align-items text-xs mt-4"
                    style={{ color: confirmPassword ? '#D8F828' : 'red' }}
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
            
            <div className='flex flex-col items-center mb-6'>
              <button
                type="submit"
                disabled={!isValid || !confirmPassword}
                className="bg-purple text-lilac text-base py-1 px-6 rounded mb-6 hover:bg-accent-violet disabled:bg-dark-violet disabled:text-violet-black"
              >
                Create an account
              </button>
            </div>


            <div className="flex items-center mb-2 ">
              <div className="border-t flex-grow border-lilac"></div>
              <span className="mx-4 text-sm text-lilac">OR</span>
              <div className="border-t flex-grow border-lilac"></div>
            </div>

            {/*Social Sign*/}
            <SocialIcons
              onGitClick={handleGitClick}
              on42Click={handle42Click}
            />
          </form>

          <p className="text-sm text-center text-lilac mb-8">
            You have an account?{' '}
            <Link to="/sign-in" className="text-lilac underline">
              Login now
            </Link>
          </p>

        </div>
      </section>
    </div>
  );
};

export default SignupForm;
