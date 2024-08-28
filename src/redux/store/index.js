import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import thunk from "redux-thunk";
import walletSlice from "../slice/wallet";
import constantSlice from "../slice/constant";
import { encryptTransform } from "redux-persist-transform-encrypt";

const encryptor = encryptTransform({
  secretKey: "root-key",
  onError: function (error) {
    console.error("Encryption error:", error);
  },
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["wallet"],
  transforms: [encryptor],
};

const rootReducer = combineReducers({
  wallet: walletSlice,
  constant: constantSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  // middleware: [thunk],
});

export const persistor = persistStore(store);

export default store;
