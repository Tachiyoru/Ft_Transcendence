import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedChannelState {
	selectedChannelId: number | null;
	prevChannelId: number | null,
}

const initialState: SelectedChannelState = {
	selectedChannelId: null as number | null,
	prevChannelId: null as number | null,
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
	},
});

export const { setSelectedChannelId } = selectedChannelSlice.actions;
export const { setPrevChannelId } = selectedChannelSlice.actions;

export default selectedChannelSlice.reducer;
