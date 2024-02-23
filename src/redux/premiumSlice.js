import { createSlice } from '@reduxjs/toolkit';

export const premiumSlice = createSlice({
    name: 'premium',
    initialState: {
        isPremium: false,
        loading: false,
        error: null,
    },
    reducers: {
        upgradeToPremiumStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        upgradeToPremiumSuccess: (state) => {
            state.isPremium = true;
            state.loading = false;
        },
        upgradeToPremiumFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { upgradeToPremiumStart, upgradeToPremiumSuccess, upgradeToPremiumFailed } = premiumSlice.actions;

export default premiumSlice.reducer;
