import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedChannelState {
	selectedChannelId: number | null;
}

const initialState: SelectedChannelState = {
	selectedChannelId: null as number | null,
};

const selectedChannelSlice = createSlice({
	name: 'selectedChannel',
	initialState,
	reducers: {
    setSelectedChannelId(state, action: PayloadAction<number>) {
		state.selectedChannelId = action.payload;
    },
	},
});

export const { setSelectedChannelId } = selectedChannelSlice.actions;

export default selectedChannelSlice.reducer;
