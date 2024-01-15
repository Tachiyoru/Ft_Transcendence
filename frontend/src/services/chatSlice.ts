import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface ChatState {
	user: string | null;
}  

const initialState: ChatState = {
    user: null
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        selectUsersInChannel: (state, action: PayloadAction<string | null>) => {
            state.chat = action.payload
        },
    }
})

export const {setUsersInChannel} = chatSlice.actions

export default chatSlice.reducer