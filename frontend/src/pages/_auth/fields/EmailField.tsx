import { AiOutlineMail } from "react-icons/ai";

const EmailField = ({ register, errors, showUsernameErrors, resStatus, setShowUsernameErrors}) => (
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
		className= 'px-5 py-4 text-lilac placeholder-lilac placeholder-opacity-40 bg-transparent outline-none'
		/>

	</div>
	{
	showUsernameErrors && errors.email?.message && 
	(<p className='text-red-500 text-xs mt-1'>{errors.email?.message}</p>)
	}
	</div>
);

export default EmailField