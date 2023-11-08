import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCheck } from 'react-icons/ai'
import { useForm } from "react-hook-form";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

interface IdataRegister {
	username: string;
	email: string;
	password: string;
}

const SignupForm = () => {

	const [resStatus, setResStatus] = useState("");
	const {authenticated, setAuthenticated} = useContext(AuthContext)
	const navigate = useNavigate();
	
	const [password, setPassword] = useState('');
	const [passwordIsVisible, setPasswordIsVisible] = useState(false);
	const [passwordHasContent, setPasswordHasContent] = useState(false);
	const passwordHasLowercaseLetter = /[a-z]/.test(password);
	const passwordHasUppercaseLetter = /[A-Z]/.test(password);
	const passwordHasSpecialCharacter = /[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?]/.test(password);
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
		.post("http://localhost:5000/auth/signup", data)
		.then( (response) => {
			console.log(response.status);
			if (response.status === 201) {
				setResStatus("Successful Registration!");
				setAuthenticated(true);
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

	console.log(resStatus);

	const handlePasswordChange = (e) => {
		const newPassword = e.currentTarget.value;
		setPassword(newPassword);
		setPasswordHasContent(newPassword.length > 0);
	};

	return (
		<div>
		<section className='container mx-auto px-5 py-10'>
			<div className='w-full max-w-sm mx-auto'>
				<h1 className='text-2x1 text-center mb-8'>Create an Account</h1>
				<form onSubmit={handleSubmit(submitHandler)}>

				{/*Form name*/}
				<div className='mb-2 w-full'>
					<div className='flex flex-row items-center border-b'>
						<AiOutlineUser className= 'w-4 h-4'/>
						<input
						type="text"
						id="name"

						{...register("username" , {
							minLength: {
							value: 1,
							message: 'Name length must be at least 1 character:',
							},
							required: {
							value: true,
							message: 'Name is required',
							}
						})}
						placeholder='Enter name'
						className={`px-5 py-4 outline-none ${errors.username ? "border-red-500" : "outline-none"}`}
						/>
						
					</div>
					{
					errors.username?.message && 
					(<p className='text-red-500 text-xs mt-1'>{errors.username?.message}</p>)
					}
					{!errors.username?.message && resStatus && (<p className='text-red-500 text-xs mt-1'>Name already exist</p>)}
				</div>

				{/*Form Email*/}
				<div className='mb-2 w-full'>
					<div className='flex flex-row items-center border-b'>
						<AiOutlineMail className= 'w-4 h-4'/>
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
						className= 'px-5 py-4 outline-none'
						/>

					</div>
					{
					errors.email?.message && 
					(<p className='text-red-500 text-xs mt-1'>{errors.email?.message}</p>)
					}
				</div>

				{/*Form Password*/}
				<div className='mb-6 w-full'>
					<div className='flex flex-row items-center border-b'>
						<AiOutlineLock className= 'w-4 h-4'/>
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
						className= 'px-5 py-4 w-full outline-none'
						onChange={handlePasswordChange}
						/>
						<button onClick={() => setPasswordIsVisible((prevState) => !prevState)}>
							{passwordIsVisible ? <AiOutlineEyeInvisible className= 'w-4 h-4'/> : <AiOutlineEye className= 'w-4 h-4'/> }
						</button>
					</div>

					{passwordHasContent && (
					<ul>
						<li className="flex align-items text-sm mt-4" style={{ color: passwordHasLowercaseLetter ? 'green' : 'red' }}>
							<AiOutlineCheck className="mt-0.5 mr-2"/> 
							One lower letter
						</li>
						<li className="flex align-items text-sm" style={{color: passwordHasUppercaseLetter ? 'green' : 'red'}}>
							<AiOutlineCheck className="mt-0.5 mr-2"/> 
							One uppercase letter
						</li>
						<li className="flex align-items text-sm" style={{color: (passwordHasSpecialCharacter || passwordHasNumber) ? 'green' : 'red'}}>
							<AiOutlineCheck className="mt-0.5 mr-2"/> 
							One number or special character
						</li>
						<li className="flex align-items text-sm" style={{color: passwordHasValidLength ? 'green' : 'red'}}>
							<AiOutlineCheck className="mt-0.5 mr-2"/> 
							Minimum 6 characters
						</li>
					</ul>
					)}

					{
					errors.password?.message && 
					(<p className='text-red-500 text-xs mt-1'>{errors.password?.message}</p>)
					}
				</div>

				<button
					type="submit"
					disabled={!isValid}
					className="border bg-gray-200 py-2 px-10 w-full rounded mb-6 disabled:opacity-40"
				>
					Create an account
				</button>
				
				<p className="text-sm">
					You have an account?{" "}
					<Link to="/sign-in" className="underline">
					Login now
					</Link>
				</p>
				</form>
			</div>
		</section>
		</div>
	)
}

export default SignupForm