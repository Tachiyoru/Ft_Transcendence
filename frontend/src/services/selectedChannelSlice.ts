import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedChannelState {
	selectedChannelId: number | null;
	prevChannelId: number | null;
	selectedUser: Users | null;
	channelUsers: { [key: number]: Users[] };
	usersNotInChannel: { [key: number]: Users[] };
	channelOperators: { [key: number]: Users[] };
}

interface Users {
	username: string;
	avatar: string;
	id: number;
	status: string;
}

const initialState: SelectedChannelState = {
	selectedChannelId: null as number | null,
	prevChannelId: null as number | null,
	selectedUser: null as Users | null,
	channelUsers: {},
	usersNotInChannel: {},
	channelOperators: {}
};

const selectedChannelSlice = createSlice({
	name: 'selectedChannel',
	initialState,
	reducers: {
		setSelectedChannelId(state, action: PayloadAction<number>) {
		state.selectedChannelId = action.payload;
		},
		setPrevChannelId(state, action: PayloadAction<number>) {
		state.prevChannelId = action.payload;
		},
		setSelectedUserProfile(state, action: PayloadAction<Users>) {
			state.selectedUser = action.payload;
		},
		setUsersInChannel(state, action: PayloadAction<{ channelId: number | null; users: Users[] }>) {
		const { channelId, users } = action.payload;
		if (channelId !== null) 
			state.channelUsers[channelId] = users;
		},

		setUsersNotInChannel(state, action: PayloadAction<{ channelId: number | null; users: Users[] }>) {
			const { channelId, users } = action.payload;
			if (channelId !== null) 
				state.usersNotInChannel[channelId] = users;
		},
		setUsersOperatorsChannel(state, action: PayloadAction<{ channelId: number | null; users: Users[] }>) {
			const { channelId, users } = action.payload;
			if (channelId !== null) 
				state.channelOperators[channelId] = users;
		},
	},
});

export const { setSelectedChannelId } = selectedChannelSlice.actions;
export const { setPrevChannelId } = selectedChannelSlice.actions;
export const { setSelectedUserProfile } = selectedChannelSlice.actions;
export const { setUsersInChannel } = selectedChannelSlice.actions;
export const { setUsersNotInChannel } = selectedChannelSlice.actions;
export const { setUsersOperatorsChannel } = selectedChannelSlice.actions;

export default selectedChannelSlice.reducer;
