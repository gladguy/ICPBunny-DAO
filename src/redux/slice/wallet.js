import { createSlice } from "@reduxjs/toolkit";

const state = {
  principalId: null,
  accountId: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState: state,
  reducers: {

    setAccountId: (state, action) => {
      state.accountId = action.payload;
    },

    setPrincipalId: (state, action) => {
      state.principalId = action.payload;
    },

    clearWalletState: (state) => {
      state.principalId = null;
      state.accountId = null;
      state.bunnyActor = null;
      state.carrotActor = null;
      state.daoActor = null;
    }
  },
});

export const {
  setAccountId,
  setPrincipalId,
  clearWalletState
} = walletSlice.actions;
export default walletSlice.reducer;
