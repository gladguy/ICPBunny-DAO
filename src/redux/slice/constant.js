import { createSlice } from "@reduxjs/toolkit";

const state = {
    canisters: null,
    daoCanisters: null,
};

const constantSlice = createSlice({
    name: "constant",
    initialState: state,
    reducers: {
        setDaoCanisters: (state, action) => {
            state.daoCanisters = action.payload;
        },

        setCanisters: (state, action) => {
            state.canisters = action.payload;
        },
    },
});

export const {
    setCanisters,
    setDaoCanisters,
} = constantSlice.actions;
export default constantSlice.reducer;
