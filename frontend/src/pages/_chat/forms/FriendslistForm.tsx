import { useState, useEffect } from 'react';
import axios from 'axios';

// const FriendslistForm = () => {
// 	const [friends, setFriends] = useState([]);

// 	useEffect(() => {
// 		axios.get('http://localhost:3001/friendslist').then((response) => {
// 			setFriends(response.data);
// 		});
// 	}, []);