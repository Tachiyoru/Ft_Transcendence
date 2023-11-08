import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai'
import { useForm } from "react-hook-form";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

interface IdataLogin {
	username: string;
	email: string;
	password: string;
}

const SigninForm = () => {

	const [resStatus, setResStatus] = useState('');
	const {authenticated, setAuthenticated} = useContext(AuthContext)
	const navigate = useNavigate();

	const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    } = useForm<IdataLogin>();

	const submitHandler = (data: IdataLogin) => {
		console.log(data);
		axios
		.post("http://localhost:5000/auth/signin", data)
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

    console.log(errors);
    
	return (
		<div>
		<section className='container mx-auto px-5 py-10'>
			<div className='w-full max-w-sm mx-auto'>
				<h1 className='text-2x1 text-center mb-8'>Login</h1>
				<form onSubmit={handleSubmit(submitHandler)}>

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
				<div className='mb-2 w-full'>
					<div className='flex flex-row items-center border-b'>
							<AiOutlineLock className= 'w-4 h-4'/>
							<input
							type="password"
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

							placeholder='•••••••'
							className= 'px-5 py-4 outline-none'
							/>
					</div>
					{
					errors.password?.message && 
					(<p className='text-red-500 text-xs mt-1'>{errors.password?.message}</p>)
					}
				</div>

				<Link to="/forget-password" className="text-sm underline ">
					Forgot password?
				</Link>

				{ resStatus && (<p className='text-red-500 text-xs mt-1'>Invalid username or password</p>)}

				<button
					type="submit"
					disabled={!isValid}
					className="border bg-gray-200 mt-6 py-2 px-10 w-full rounded mb-6 disabled:opacity-40"
				>
					Sign In
				</button>
				<p className="text-sm">
					Do not have an account?{" "}
					<Link to="/sign-up" className="underline ">
						Register now
					</Link>
				</p>
				</form>
			</div>
		</section>
		</div>
  )
}

export default SigninForm