import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface User {
	username: string;
	id: number;
}

interface gameData
{
	gameInviteId: number;
	hostId: number;
	invitedId: number;
}

interface invitedFriendState {
	invitedFriend: User | null;
    game: gameData | null
}  

const initialState: invitedFriendState = {
    invitedFriend: null,
    game: null
}

const invitedFriendSlice = createSlice({
    name: 'gameInvit',
    initialState,
    reducers: {
        setInvitedFriend: (state, action: PayloadAction<User | null>) => {
            state.invitedFriend = action.payload
        },
        setGameData: (state, action: PayloadAction<gameData | null>) => {
            state.game = action.payload
        },
    }
})

export const {setInvitedFriend, setGameData} = invitedFriendSlice.actions

export default invitedFriendSlice.reducer