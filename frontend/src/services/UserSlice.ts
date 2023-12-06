import {createSlice} from '@reduxjs/toolkit'

interface userSlice {
	user: string | null;
}  

const initialState = {
    user: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload
        },
        setLogout: (state) => {
            state.user = null
        }
    }
})

export const {loginSuccess , setLogout} = userSlice.actions

export default userSlice.reducer