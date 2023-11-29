import { useState, ChangeEvent, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineCheck,
} from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import UserNameField from '../fields/UserNameField';
import EmailField from '../fields/EmailField';
import SocialIcons from '../fields/SocialIcons';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';

interface IdataRegister {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupForm = () => {
  const [cookies] = useCookies(['user_token']);
  const dispatch = useDispatch();

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

  const submitHandler = (data: IdataRegister) => {
    console.log(data);
    axios
      .post('http://localhost:5001/auth/signup', data)
      .then((response) => {
        console.log("test", response.status);
        if (response.status === 201 && cookies['user_token']) {
          setResStatus('Successful Registration!');
          const token = cookies['user_token'];
          console.log("salut", token);
          dispatch(loginSuccess(`Bearer ${token}`)); 

          navigate('/');
        } else {
          setResStatus('Error');
        }
      })
      .catch(function (error) {
        setResStatus('Error');
        console.log(error.response.data.message);
      });
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
      <section className="container bg-black bg-opacity-70 rounded-md mt-20 px-5 py-10">
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
                  className="px-5 py-4 w-full text-lilac placeholder-lilac placeholder-opacity-40 bg-transparent outline-none"
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
                  className="px-5 py-4 w-full text-lilac placeholder-lilac placeholder-opacity-40 bg-transparent outline-none"
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
              className="border bg-lilac py-2 px-10 w-full rounded mb-6 disabled:opacity-40"
            >
              Create an account
            </button>

            <p className="text-sm text-center text-lilac mb-8">
              You have an account?{' '}
              <Link to="/sign-in" className="text-lilac underline">
                Login now
              </Link>
            </p>

            <div className="flex items-center mb-2 ">
              <div className="border-t flex-grow border-lilac"></div>
              <span className="mx-4 text-sm text-lilac">OR</span>
              <div className="border-t flex-grow border-lilac"></div>
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
