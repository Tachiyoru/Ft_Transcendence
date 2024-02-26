import { useEffect, useState } from "react";
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
  const [tokenGoogle, setTokenGoogle] = useState<string>("");
	const [userData, setUserData] = useState<{otpAuthUrl: string, isTwoFaEnabled: boolean, username: string} | undefined>();
  const [isQrCode, setIsQrCode] = useState<boolean>(false);
  const [isTwoFaEnabled, setIsTwoFaEnabled] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

	useEffect(() => {
		const fetchData = async () => {
		try {
			const userDataResponse = await axios.get('/users/me');
			setUserData(userDataResponse.data);
      if (userDataResponse.data.otpAuthUrl)
        setIsQrCode(true);
      if(userDataResponse.data.isTwoFaEnabled)
        setIsTwoFaEnabled(true);
		} catch (error) {
      console.error('Error fetching user data:', error);
		}
		};
		fetchData();
	}, []);
  
  
	const {
		register,
		handleSubmit,
    watch,
		formState: { errors, isValid },
    trigger,
    } = useForm<IdataRegister>();

    const submitHandler = async (data: IdataRegister) => {
      try {
        if (data.newPassword !== data.confirmPassword) {
          console.error('New Password and Confirm Password do not match');
          return;
        }
    
        await axios.patch('/users/edit', { password: data.password, newPassword: data.newPassword});
    
      } catch (error) {
          console.error(error.response.data.message);
          setError('Invalid password');
      }
    };

    const handleQrCode = async (isChecked: boolean) => {
      try {
        await axios.post('/two-fa/set-status');
        console.log("otpAuthUrl : ", userData?.otpAuthUrl);
        if (!userData?.otpAuthUrl)
          await axios.get('/two-fa/generate-qrcode');
        const userDataResponse = await axios.get('/users/me');
        setUserData(userDataResponse.data);
        setIsQrCode(isChecked);
        setIsTwoFaEnabled(false)
      } catch (error) {
        console.error("Error two-fa verification", error);
      }
    };
	
  const handleSubmitTwoFa = async () => {
    try {
      await axios.post('/two-fa/authenticate', {token: tokenGoogle});
      setIsTwoFaEnabled(true)
    } catch (error) {
      console.error("Error two-fa verification", error);
    }
  };

  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');
  
	return (
	<div className="mx-2">
		{/*TITLE*/}
		<div className="text-lilac mt-4 mb-6">
			<h2>Password and Security</h2>
			<p className="text-xs">Manage security preferences</p>
		</div>

		{/*CHANGE*/}
    {!(userData?.username.includes("_42") || userData?.username.includes("_git")) &&
		<form onSubmit={handleSubmit(submitHandler)}>
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
            {error && <div className="text-xs mt-2 text-red-orange">{error}</div>}


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
                  onChange={() => {
                    trigger('newPassword');
                    trigger('confirmPassword');
                  }}
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
                    validate: value => value === newPassword || 'Passwords do not match',
                  })}
                  
                  placeholder="Confirm New Password"
                  className="px-5 py-3 w-full text-sm text-lilac placeholder-lilac placeholder-opacity-40 bg-transparent outline-none"
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
              {errors.confirmPassword && (
                <div className="text-xs mt-2 text-red-orange">{errors.confirmPassword.message}</div>
              )}
            </div>



            <button
              type="submit"
              disabled={!isValid}
              className="text-sm bg-purple text-lilac py-2 px-5 rounded mb-6 disabled:opacity-40"
            >
              Save changes
            </button>
          </form>
        }
		{/*2FA*/}
			<div>
				<div className="flex flex-row items-center mb-6">
					<h3 className="text-sm text-lilac mr-4">2-Step Verification</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" checked={isQrCode} onChange={() => handleQrCode(!isQrCode)}/>
            <div className={`w-9 h-5 bg-dark-violet peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:absolute after:top-[2px] after:start-[2px]  after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple ${isQrCode ? 'after:bg-acid-green' : 'after:bg-purple'}`}></div>
            {isQrCode ? (
              <>
                <span className="absolute left-1 text-[0.45rem] text-lilac">ON</span>
              </>
            ) : (
              <>
                <span className="absolute right-0.5 text-[0.45rem] text-lilac">OFF</span>
              </>
            )}
          </label>
        </div>
					{(isQrCode && !isTwoFaEnabled) && (
					<div className="flex flex-row gap-x-4">
						<img src={userData?.otpAuthUrl} className="w-32 h-32"/>
            <div className="flex flex-col gap-y-4">
							<input
											type="text"
											placeholder="Enter auth code"
											value={tokenGoogle}
											onChange={(e) => {
												setTokenGoogle(e.target.value);
											}}
											className="border-b border-lilac bg-transparent text-lilac placeholder:text-lilac focus:outline-none text-sm p-2"
							/>
							<button
									disabled={tokenGoogle.length === 0}
									className='bg-purple text-lilac rounded-md text-sm p-2 w-32 disabled:text-violet-black disabled:bg-dark-violet disabled:cursor-not-allowed'
									onClick={handleSubmitTwoFa}
									>
										Save Change
							</button>
              {!isTwoFaEnabled ? (
                  <p className="text-red-orange text-xs">2FA Not active</p>
                ) : (
                  <p className="text-acid-green text-xs">2FA Active</p>
              )}
              </div>
					</div>
					)}
		</div>
	</div>

	
  )
}

export default SecurityEdit