import axios from "axios";

const API_URL = "http://localhost:5000/";

class AuthService {
	const register = (username: string, email: string, password: string) => {
		return axios.post(API_URL + "signup", {
			username,
			email,
			password,
		})
		.then((response) => {
			if (response.data.username) {
				localStorage.setItem("user", JSON.stringify(response.data));
			}

			return response.data;
		});
	};

	getCurrentUser() {
		const userStr = localStorage.getItem("user");
		if (userStr) return JSON.parse(userStr);

		return null;
	}
}


export default new AuthService();