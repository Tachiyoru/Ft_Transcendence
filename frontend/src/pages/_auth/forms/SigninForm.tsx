import { ReactNode } from "react";

import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineGoogle,
  AiOutlineEyeInvisible,
  AiOutlineEye,
} from "react-icons/ai";
import { useForm } from "react-hook-form";
import axios from "axios";
import { setAuthenticated } from "../../../context/AuthUtils";
import { AuthContext } from "../../../context/AuthContext";
import { Si42 } from "react-icons/si";

interface IdataLogin {
  username: string;
  email: string;
  password: string;
}

interface IconContainerProps {
  children: ReactNode;
}

const SigninForm = () => {
  const [resStatus, setResStatus] = useState("");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [showUsernameErrors, setShowUsernameErrors] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IdataLogin>();

  const submitHandler = (data: IdataLogin) => {
    console.log(data);
    axios
      .post("http://localhost:5000/auth/signin", data)
      .then((response) => {
        console.log(response.status);
        if (response.status === 201) {
          setResStatus("Successful Registration!");
          setAuthenticated(response.data.access_token);
          navigate("/");
        } else {
          setResStatus("Error");
        }
      })
      .catch(function (error) {
        setResStatus("Error");
        console.log(error);
      });
  };

  const IconContainer: React.FC<IconContainerProps> = ({ children }) => (
    <div className="flex items-center justify-center border rounded m-6 border-gray-300 w-10 h-10">
      {children}
    </div>
  );

  const handleSignin42 = () => {
    navigate("/42API");
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.currentTarget.value;
    setPassword(newPassword);
    setShowUsernameErrors(true);
  };

  return (
    <div>
      <section className="container mx-auto px-5 py-10">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-2x1 text-center mb-8">Login</h1>
          <form onSubmit={handleSubmit(submitHandler)}>
            {/*Form Email*/}
            <div className="mb-2 w-full">
              <div className="flex flex-row items-center border-b">
                <AiOutlineMail className="w-4 h-4" />
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
                  placeholder="Enter Email c qui le boss ?"
                  className="px-5 py-4 outline-none"
                />
              </div>
              {showUsernameErrors && errors.email?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email?.message}
                </p>
              )}
            </div>

            {/*Form Password*/}
            <div className="mb-2 w-full">
              <div className="flex flex-row items-center border-b">
                <AiOutlineLock className="w-4 h-4" />
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
              {showUsernameErrors && errors.password?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password?.message}
                </p>
              )}
            </div>

            <Link to="/forget-password" className="text-sm underline ">
              Forgot password?
            </Link>

            {resStatus && (
              <p className="text-red-500 text-xs mt-1">
                Invalid username or password
              </p>
            )}

            <button
              type="submit"
              disabled={!isValid}
              className="border bg-gray-200 mt-6 py-2 px-10 w-full rounded mb-6 disabled:opacity-40"
            >
              Sign In
            </button>
            <p className="text-sm mb-6">
              Do not have an account?{" "}
              <Link to="/sign-up" className="underline ">
                Register now
              </Link>
            </p>

            <div className="flex items-center mb-2 ">
              <div className="border-t flex-grow border-gray-300"></div>
              <span className="mx-4 text-sm text-gray-500">OR</span>
              <div className="border-t flex-grow border-gray-300"></div>
            </div>

            {/*Social Sign*/}
            <div className="flex items-center justify-center">
              <IconContainer>
                <button onClick={handleSignin42}>
                  <AiOutlineGoogle className="w-4 h-4" />
                </button>
              </IconContainer>

              <IconContainer>
                <button onClick={handleSignin42}>
                  <Si42 className="w-4 h-4" />
                </button>
              </IconContainer>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default SigninForm;
