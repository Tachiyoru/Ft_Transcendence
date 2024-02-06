import { useState } from "react";
import axios from "../../../axios/api";
import { loginSuccess } from "../../../services/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineLock } from "react-icons/ai";

const SigninForm2Fa = () =>
{
	const [tokenGoogle, setTokenGoogle] = useState<string>("");
	const [resStatus, setResStatus] = useState<string>('');
	const navigate = useNavigate();

	const handleSubmitTwoFa = async () =>
	{
		try {
			console.log(tokenGoogle)
				const isValid = await axios.post('/two-fa/authenticate', { token: tokenGoogle });
				console.log(isValid);
			setResStatus("Successful Registration!");
			navigate("/");
		} catch (error) {
				setResStatus("Failed Registration...");
		console.error("Error two-fa verification", error);
		}
	};

	return (
		<div className="bg-violet-black-nav min-h-screen flex justify-center items-center">
			<section className="w-full max-w-sm border-container">
				<div className="mx-auto px-16 py-10">
					<h1 className="text-xl font-audiowide font-outline-2 text-white text-center mb-8">
						2FA AUTH
					</h1>
						<div className="flex flex-col items-center">
						<div className="flex flex-row items-center border-b border-lilac">
							<AiOutlineLock className="w-4 h-4 text-lilac  mb-2" />
							<input
								type="text"
								placeholder="Enter authentification code"
								value={tokenGoogle}
								onChange={(e) => {
									setTokenGoogle(e.target.value);
								}}
								className="bg-transparent ml-2 mb-2 placeholder:text-lilac placeholder:text-opacity-40 text-lilac focus:outline-none text-sm p-2 m-auto"
							/>
						</div>
						{resStatus && <p className="text-red-orange text-xs mt-1">{resStatus}</p>}
						<button
								disabled={tokenGoogle.length === 0}
								className=' bg-purple text-lilac rounded-md text-sm py-2 px-4 mt-10 disabled:bg-dark-violet disabled:text-violet-black'
								onClick={handleSubmitTwoFa}
								>
									Save Change
						</button>
						</div>
					</div>
				</section>
		</div>
	)
}

export default SigninForm2Fa