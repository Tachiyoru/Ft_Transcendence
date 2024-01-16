import { useState } from "react";
import axios from "../../../axios/api";
import { loginSuccess } from "../../../services/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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
		<div className="flex flex-row">
			<div>
				<input
					type="text"
					placeholder="Search..."
					value={tokenGoogle}
					onChange={(e) => {
						setTokenGoogle(e.target.value);
					}}
					className="bg-dark-violet text-lilac rounded-md focus:outline-none text-sm p-2"
				/>
				{resStatus && <p className="text-red-orange">{resStatus}</p>}
				</div>
				<button
						disabled={tokenGoogle.length === 0}
						className='ml-2 bg-purple text-lilac rounded-md text-sm p-2'
						onClick={handleSubmitTwoFa}
						>
							Save Change
				</button>
		</div>
	)
}

export default SigninForm2Fa