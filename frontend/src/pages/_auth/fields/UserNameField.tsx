import { AiOutlineUser } from "react-icons/ai";

const UserNameField = ({ register, errors, showUsernameErrors, resStatus, setShowUsernameErrors}) => (

	<div className='mb-2 w-full'>
		<div className='flex flex-row items-center border-lilac border-b'>
			<AiOutlineUser className= 'w-4 h-4 text-lilac'/>
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
			className={`input px-5 py-4 text-lilac text-sm placeholder-lilac placeholder-opacity-40 bg-transparent outline-none ${errors.username ? "border-red-500" : "outline-none"}`}
			/>
		</div>

		{ showUsernameErrors && errors.username?.message && (
			<p className='text-red-500 text-xs mt-1'>{errors.username?.message}</p>
		)}

		{ showUsernameErrors && !errors.username?.message && resStatus && (
			<p className='text-red-500 text-xs mt-1'>Name or Email already exist</p>
		)}
	
	</div>

);

export default UserNameField