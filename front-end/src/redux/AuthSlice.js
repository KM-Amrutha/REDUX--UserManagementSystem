import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
        console.log('🔥 LOGOUT REDUCER TRIGGERED');
      state.user = null;
       
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
