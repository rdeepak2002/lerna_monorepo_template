import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface UserSessionState {
    current: any
}

const initialState: UserSessionState = {
    current: undefined,
}

export const userSessionSlice = createSlice({
    name: 'userSession',
    initialState,
    reducers: {
        updateUserSession: (state, action: PayloadAction<any>) => {
            state.current = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {updateUserSession} = userSessionSlice.actions

export default userSessionSlice.reducer
