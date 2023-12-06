import React, { ChangeEvent, useState } from 'react';
import { AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCheck } from 'react-icons/ai';

interface PasswordFieldProps {
	register: any;
	errors: any;
	label: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ register, errors, label }) => {
	const [password, setPassword] = useState('');
	const [passwordIsVisible, setPasswordIsVisible] = useState(false);

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.currentTarget.value);
};

return (
<div className='mb-4 w-full '>
	<div className='flex flex-row items-center border-b'>
	<AiOutlineLock className='w-4 h-4' />
	<input
		type={passwordIsVisible ? 'text' : 'password'}
		id={label.toLowerCase()}
		{...register(label.toLowerCase(), {
		required: {
			value: true,
			message: `${label} is required`,
		},
		minLength: {
			value: 6,
			message: `${label} length must be at least 6 characters`,
		},
		})}
		placeholder={`Enter ${label}`}
		className='px-5 py-4 w-full outline-none'
		onChange={handlePasswordChange}
	/>
	<button
		onClick={() => {
		setPasswordIsVisible((prevState) => !prevState);
		}}
	>
		{passwordIsVisible ? <AiOutlineEyeInvisible className='w-4 h-4' /> : <AiOutlineEye className='w-4 h-4' />}
	</button>
	</div>

	{password && (
	<ul>
		<li className="flex align-items text-xs mt-4" style={{ color: /[a-z]/.test(password) ? 'green' : 'red' }}>
		<AiOutlineCheck className="mt-0.5 mr-2"/>
		One lower letter
		</li>
	</ul>
	)}

	{errors[label.toLowerCase()] && <p className='text-red-500 text-xs mt-1'>{errors[label.toLowerCase()]?.message}</p>}
</div>
);
};

export default PasswordField;