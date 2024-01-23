import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { FaUser } from "react-icons/fa6";
import axios from "../../../axios/api";
import FileUpload from "../../../components/photo/FileUpload";
import { useNavigate } from "react-router-dom";

interface IdataRegister {
	username: string;
	email: string;
}

const AccountEdit = () => {
	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState<{
		username: string;
		avatar: string;
		email: string;
		createdAt: string;
	} | undefined>();
	const navigate = useNavigate()
	const {
		register,
		handleSubmit,
		formState: { isValid },
		watch,
	} = useForm<IdataRegister>();

	const { username, email } = watch();

	useEffect(() => {
		const fetchData = async () => {
		try {
			const userDataResponse = await axios.get('/users/me');
			setUserData(userDataResponse.data);
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
		};
		fetchData();
	}, []);

	const submitHandler = async () => {
		try {
		setLoading(true);
		const filteredData: Partial<IdataRegister> = {};

		if (username) {
			filteredData.username = username;
			console.log("username : ", filteredData.username);
			await axios.post(`achievements/add/${4}`);
		}

		if (email) {
			filteredData.email = email;
			console.log("email : ", filteredData.email);
		}

		await axios.patch("/users/edit", filteredData);

		console.log("User data updated successfully:", filteredData);
		} catch (error) {
		console.error("Error updating user data:", error);
		} finally {
		setLoading(false);
		}
	};

	const handleDeleteAccount = async () => {
		try {
			axios.delete('/users/delete-user');
			navigate("/sign-in")
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	};

	return (
		<div className="my-4 mx-2 relative h-full">
			{/*TITLE*/}
			<div className="text-lilac">
				<h2>Profile and account</h2>
				<p className="text-xs">Manage profile preferences</p>
			</div>

		{/*PHOTO*/}
			<div className="text-lilac mt-4 flex flex-row items-center">
				{userData && userData.avatar ? (
					<img src={userData.avatar} className="h-20 w-20 object-cover rounded-full text-lilac" alt="User Avatar" />
					) : (
					<div className="bg-purple rounded-full p-2 mt-2">
						<FaUser className="w-[60px] h-[60px] p-3 text-lilac"/>
					</div>
				)}
				<div>
				<FileUpload />
				</div>
			</div>

			{/*CHANGE*/}
			<form onSubmit={handleSubmit(submitHandler)} className="mt-6">
				<div className="flex flex-row w-60 items-center border-lilac border-b">
				<AiOutlineUser className="w-4 h-4 text-lilac" />
				<input
					type="text"
					id="name"
					{...register("username", {
					minLength: {
						value: 1,
						message: "Name length must be at least 1 character:",
					},
					})}
					placeholder={userData?.username}
					className="px-5 py-3 text-sm text-lilac placeholder-lilac placeholder-opacity-40 bg-transparent outline-none"
				/>
				</div>

				<div className="flex flex-row w-60 items-center border-b border-lilac">
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
					})}
					placeholder={userData?.email ? userData.email : "Enter an email"}
					className="px-5 py-3 text-sm text-lilac placeholder-lilac placeholder-opacity-40 bg-transparent outline-none"
				/>
				</div>
				<button
				type="submit"
				disabled={!isValid}
				className="mt-4 text-sm bg-dark-violet py-2 px-5 rounded mb-6 disabled:opacity-40"
				>
				Save changes
				</button>
			</form>

			{/*DELETE ACCOUNT*/}
			<p
				className="text-xs text-red-orange underline absolute bottom-10"
				style={{ cursor: "pointer" }}
				onClick={handleDeleteAccount}
			>
				Delete Account
			</p>
		</div>
	);
};

export default AccountEdit;
