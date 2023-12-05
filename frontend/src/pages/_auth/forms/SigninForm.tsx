import { ReactNode } from 'react';

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMail, AiOutlineLock, AiOutlineGoogle, AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'
import { useForm } from "react-hook-form";
import axios from "axios";
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

	const [resStatus, setResStatus] = useState('');
	const navigate = useNavigate();

	const [password, setPassword] = useState('');
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
		.post("http://localhost:5001/auth/signin", data)
		.then( (response) => {
		console.log(response.status);
		if (response.status === 201) {
			setResStatus("Successful Registration!");
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

	const IconContainer : React.FC<IconContainerProps> = ({ children }) => (		<div className="flex items-center justify-center border rounded m-6 border-lilac w-10 h-10">
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
		<div className='bg-violet-black-nav min-h-screen flex justify-center items-center'>
		<section className='w-full max-w-sm border-container'>
			<div className='mx-auto p-8'>
				<h1 className='text-xl font-outline-2 text-white text-center mb-8'>Login</h1>
				<form onSubmit={handleSubmit(submitHandler)}>

				{/*Form Email*/}
				<div className='mb-2 w-full'>
					<div className='flex flex-row items-center border-b border-lilac'>
						<AiOutlineMail className= 'w-4 h-4 text-lilac'/>
						<input
						type="email"
						id="email"

						{...register('email', {
							pattern: {
							value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
							message: 'Please enter a valid email',
							},
							required: {
							value: true,
							message: 'Email is required',
							},
						})}

						placeholder='Enter Email'
						className= 'px-5 py-4 text-lilac text-sm placeholder-lilac placeholder-opacity-40 bg-transparent outline-none'
						
						/>
					</div>
					{
					showUsernameErrors && errors.email?.message && 
					(<p className='text-red-orange text-xs mt-1'>{errors.email?.message}</p>)
					}
				</div>

				{/*Form Password*/}
				<div className='mb-4 w-full'>
					<div className='flex flex-row items-center border-b border-lilac'>
						<AiOutlineLock className= 'w-4 h-4 text-lilac'/>
						<input
						type={passwordIsVisible ? "text" : "password"}
						id="password"

						{...register('password', {
							required: {
							value: true,
							message: 'Password is required',
							},
							minLength: {
							value: 6,
							message: "Password length must be at least 6 characters",
							},
						})}

						placeholder='Enter Password'
						className= 'px-5 py-4 w-full text-lilac text-sm placeholder-lilac placeholder-opacity-40 bg-transparent outline-none'
						onChange={handlePasswordChange}

						/>
						<button onClick={() => {
							setPasswordIsVisible((prevState) => !prevState);
							setShowUsernameErrors(false)}}
						>
							{passwordIsVisible ? <AiOutlineEyeInvisible className= 'w-4 h-4 text-lilac'/> : <AiOutlineEye className= 'w-4 h-4 text-lilac'/> }
						</button>
					</div>
					{
					showUsernameErrors && errors.password?.message && 
					(<p className='text-red-orange text-xs mt-1'>{errors.password?.message}</p>)
					}
				</div>

				<Link to="/forget-password" className="text-sm text-lilac underline ">
					Forgot password?
				</Link>

				{ resStatus && (<p className='text-red-500 text-xs mt-1'>Invalid username or password</p>)}

				<button
					type="submit"
					disabled={!isValid}
					className="border bg-gray-200 text-lilac mt-6 py-2 px-10 w-full rounded mb-6 disabled:opacity-40"
				>
					Sign In
				</button>
				<p className="text-sm mb-6 text-lilac">
					Do not have an account?{" "}
					<Link to="/sign-up" className="underline ">
						Register now
					</Link>
				</p>

				<div className="flex items-center mb-2 ">
					<div className="border-t flex-grow border-lilac"></div>
					<span className="mx-4 text-sm text-lilac">OR</span>
					<div className="border-t flex-grow border-lilac"></div>
				</div>

				{/*Social Sign*/}
				<div className="flex items-center justify-center">
					<IconContainer>
						<button onClick={handleSignin42}>
							<AiOutlineGoogle className="w-4 h-4 text-lilac" />
						</button>
					</IconContainer>

					<IconContainer>
						<button onClick={handleSignin42}>
							<Si42 className="w-4 h-4 text-lilac" />
						</button>
					</IconContainer>
				</div>
				</form>
			</div>
		</section>
		</div>
	)
}

export default SigninForm