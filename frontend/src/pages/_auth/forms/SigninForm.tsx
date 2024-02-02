import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineEyeInvisible,
  AiOutlineEye,
} from "react-icons/ai";
import { useForm } from "react-hook-form";
import SocialIcons from "../fields/SocialIcons";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../services/UserSlice";
import axios from "../../../axios/api";
import { WebSocketContext } from "../../../socket/socket";

// const socket = useContext(WebSocketContext);

interface IdataLogin {
  username: string;
  email: string;
  password: string;
}

const SigninForm = () => {
  const dispatch = useDispatch();
  const [resStatus, setResStatus] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [showUsernameErrors, setShowUsernameErrors] = useState(false);
  const [isPasswordModified, setPasswordModified] = useState(false);
  const {
    register,
    handleSubmit,
	setError,
    formState: { errors, isValid },
  } = useForm<IdataLogin>();

  const submitHandler = async (data: IdataLogin) => {
    console.log(data);
    await axios
      .post("auth/signin", data)
      .then((response) => {
        console.log(response.status);
          setResStatus("Successful Registration!");
          dispatch(loginSuccess(response.data));
          navigate("/");
		  window.location.reload();
      })
      .catch(function (error) {
        setResStatus("Error");
        console.log(error);
      });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.currentTarget.value;
    setPassword(newPassword);
    setShowUsernameErrors(true);
	if (newPassword.length > 6)
		setPasswordModified(true);
};


  const handle42Click = async () => {
    try {
      const response =  (window.location.href =
        "http://paul-f4ar2s4:5001/auth/42/callback");
      if (response) {
        dispatch(loginSuccess(response));
      }
    } catch {
      setResStatus("Error");
    }
  };

  const handleGitClick = async () => {
    try {
      const response = (window.location.href =
        "http://paul-f4ar2s4:5001/auth/github/callback");
      if (response) dispatch(loginSuccess(response));
    } catch {
      setResStatus("Error");
    }
  };

  return (
    <div className="bg-violet-black-nav min-h-screen flex justify-center items-center">
      <section className="w-full max-w-sm border-container">
        <div className="mx-auto px-16 py-10">
          <h1 className="text-xl font-audiowide font-outline-2 text-white text-center mb-8">
            LOGIN
          </h1>
          <form onSubmit={handleSubmit(submitHandler)}>
            {/*Form Email*/}
            <div className="mb-2 w-full">
              <div className="flex flex-row items-center border-b border-lilac">
                <AiOutlineMail className="w-4 h-4 text-lilac" />
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Please enter a valid email",
                    },
                    required: {
                      value: true,
                      message: "Email is required",
                    },
                  })}
                  placeholder="Enter Email"
                  className="px-5 py-4 text-lilac text-sm placeholder-lilac placeholder-opacity-40 bg-transparent outline-none"
                />
              </div>
              {showUsernameErrors && errors.email?.message && (
                <p className="text-red-orange text-xs mt-1">
                  {errors.email?.message}
                </p>
              )}
            </div>

            {/*Form Password*/}
            <div className="mb-4 w-full">
              <div className="flex flex-row items-center border-b border-lilac">
                <AiOutlineLock className="w-4 h-4 text-lilac" />
                <input
                  type={passwordIsVisible ? "text" : "password"}
                  id="password"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                    minLength: {
                      value: 6,
                      message: "Password length must be at least 6 characters",
                    },
                  })}
                  placeholder="Enter Password"
                  className="px-5 py-4 w-full text-lilac text-sm placeholder-lilac placeholder-opacity-40 bg-transparent outline-none"
                  onChange={handlePasswordChange}
                />
                <button
				  type="button"
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
              {showUsernameErrors && errors.password?.message && (
                <p className="text-red-orange text-xs mt-1">
                  {errors.password?.message}
                </p>
              )}
            </div>

            {resStatus && (
              <p className="text-red-500 text-xs mt-1">
                Invalid username or password
              </p>
            )}

            <div className="flex flex-col items-center mt-10">
              <button
                type="submit"
                disabled={!isPasswordModified}
                className=" bg-purple text-lilac text-base py-1 px-6 rounded mb-6 hover:bg-accent-violet disabled:bg-dark-violet disabled:text-violet-black"
              >
                Sign in
              </button>
            </div>

            <div className="flex items-center mt-8 mb-2 ">
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
          <p className="text-sm text-center m-4 text-lilac">
            Do not have an account?{" "}
            <Link to="/sign-up" className="underline ">
              Register now
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default SigninForm;
