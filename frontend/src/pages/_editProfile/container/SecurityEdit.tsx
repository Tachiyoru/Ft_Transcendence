import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLock } from "react-icons/ai"
import axios from "../../../axios/api";

interface IdataRegister {
	password: string;
	newPassword: string;
	confirmPassword: string;
}
  
const SecurityEdit = () => {
	const [passwordIsVisible, setPasswordIsVisible] = useState(false);
	const [loading, setLoading] = useState(true);

	const {
		register,
		handleSubmit,
		formState: { isValid },
    } = useForm<IdataRegister>();

    const submitHandler = async (data: IdataRegister) => {

      try {
          setLoading(true);
          await axios.patch('/users/edit', data);
    
          console.log('User data updated successfully:', data);;
          } catch (error) {
              console.error('Error updating user data:', error);
          } finally {
              setLoading(false);
      }
    };

	return (
	<div className="mx-2">
		{/*TITLE*/}
		<div className="text-lilac mt-4">
			<h2>Password and Security</h2>
			<p className="text-xs">Manage security preferences</p>
		</div>

		{/*CHANGE*/}
		<form onSubmit={handleSubmit(submitHandler)} className="mt-6">
			<h3 className="text-sm text-lilac">Edit Password</h3>

			<div className="mt-4 w-full">
              <div className="w-[260px] flex flex-row items-center border-b border-lilac">
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
                  placeholder="Enter Old Password"
                  className="px-5 py-3 text-sm w-full text-lilac placeholder-lilac placeholder-opacity-40 bg-transparent outline-none"
                />
                <button
                  onClick={() => {
                    setPasswordIsVisible((prevState) => !prevState);
                  }}
                >
                  {passwordIsVisible ? (
                    <AiOutlineEyeInvisible className="w-4 h-4 text-lilac" />
                  ) : (
                    <AiOutlineEye className="w-4 h-4 text-lilac" />
                  )}
                </button>
              </div>
            </div>

			<div className="w-[260px] flex flex-row items-center border-b border-lilac">
                <AiOutlineLock className="w-4 h-4 text-lilac" />
                <input
                  type={passwordIsVisible ? 'text' : 'password'}
                  id="newPassword"
                  {...register('newPassword', {
                    required: {
                      value: true,
                      message: 'Password is required',
                    },
                    minLength: {
                      value: 6,
                      message: 'Password length must be at least 6 characters',
                    },
                  })}
                  placeholder="Enter New Password"
                  className="px-5 py-3 text-sm w-full text-lilac placeholder-lilac placeholder-opacity-40 bg-transparent outline-none"
                />
                <button
                  onClick={() => {
                    setPasswordIsVisible((prevState) => !prevState);
                  }}
                >
                  {passwordIsVisible ? (
                    <AiOutlineEyeInvisible className="w-4 h-4 text-lilac" />
                  ) : (
                    <AiOutlineEye className="w-4 h-4 text-lilac" />
                  )}
                </button>
              </div>

            <div className="mb-6 w-full">
              <div className="w-[260px] flex flex-row items-center border-lilac border-b">
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
                  placeholder="Confirm New Password"
                  className="px-5 py-3 w-full text-sm text-lilac placeholder-lilac placeholder-opacity-40 bg-transparent outline-none"/>
                <button
                  onClick={() => {
                    setPasswordIsVisible((prevState) => !prevState);
                  }}
                >
                  {passwordIsVisible ? (
                    <AiOutlineEyeInvisible className="w-4 h-4 text-lilac" />
                  ) : (
                    <AiOutlineEye className="w-4 h-4 text-lilac" />
                  )}
                </button>
              </div>
            </div>



			<button
              type="submit"
              disabled={!isValid}
              className="mt-4 border text-sm bg-lilac py-2 px-5 rounded mb-6 disabled:opacity-40"
            >
              Save changes
            </button>
		</form>

		{/*2FA*/}
		<div>
			<h3 className="text-sm text-lilac">2-Step Verification</h3>
		</div>
	</div>

	
  )
}

export default SecurityEdit