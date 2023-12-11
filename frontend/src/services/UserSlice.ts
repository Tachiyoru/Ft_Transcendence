import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface UserState {
	user: string | null;
}  

const initialState: UserState = {
    user: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<string | null>) => {
            state.user = action.payload
        },
        setLogout: (state) => {
            state.user = null
        }
    }
})

export const {loginSuccess , setLogout} = userSlice.actions

export default userSlice.reducer