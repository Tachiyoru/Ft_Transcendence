import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedChannelState {
	selectedChannelId: number | null;
	prevChannelId: number | null;
	channelUsers: { [key: number]: Users[] };
	channelBannedUsers: { [key: number]: Users[] };
	usersNotInChannel: { [key: number]: Users[] };
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
	channelUsers: {},
	channelBannedUsers: {},
	usersNotInChannel: {},
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
		setUsersInChannel(state, action: PayloadAction<{ channelId: number | null; users: Users[] }>) {
		const { channelId, users } = action.payload;
		if (channelId !== null) 
			state.channelUsers[channelId] = users;
		},
		setUsersBan(state, action: PayloadAction<{ channelId: number | null; users: Users[] }>) {
		const { channelId, users } = action.payload;
		if (channelId !== null) 
			state.channelBannedUsers[channelId] = users;
		},
		setUsersNotInChannel(state, action: PayloadAction<{ channelId: number | null; users: Users[] }>) {
			const { channelId, users } = action.payload;
			if (channelId !== null) 
				state.usersNotInChannel[channelId] = users;
			},
	},
});

export const { setSelectedChannelId } = selectedChannelSlice.actions;
export const { setPrevChannelId } = selectedChannelSlice.actions;
export const { setUsersInChannel } = selectedChannelSlice.actions;
export const { setUsersBan } = selectedChannelSlice.actions;
export const { setUsersNotInChannel } = selectedChannelSlice.actions;

export default selectedChannelSlice.reducer;
