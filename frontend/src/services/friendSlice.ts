import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface friendState {
	listUsersPending:  Users[];
	listUsersNotFriend: Users[]
}

interface Users {
	username: string;
	avatar: string;
	id: number;
	status: string;
}

const initialState: friendState = {
	listUsersPending: [],
	listUsersNotFriend: [],
};

const friendSlice = createSlice({
	name: 'friend',
	initialState,
	reducers: {
		setListUsersPending(state, action: PayloadAction< Users[] >) {
				state.listUsersPending = action.payload;
		},
		setListUsersNotFriend(state, action: PayloadAction< Users[] >) {
			state.listUsersNotFriend = action.payload;
	},
		},
	},
);

export const { setListUsersPending } = friendSlice.actions;
export const { setListUsersNotFriend } = friendSlice.actions;

export default friendSlice.reducer;
