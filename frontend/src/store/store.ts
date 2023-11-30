import { configureStore , combineReducers} from "@reduxjs/toolkit";
import {persistReducer , persistStore } from 'redux-persist'
import storage from "redux-persist/lib/storage";
import UserSlice from "../services/UserSlice";

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {key: 'root', storage , version: 1}
const rootReducer = combineReducers({user: UserSlice})
const persistedReducer = persistReducer(persistConfig , rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false,
    })
})

export const persistor = persistStore(store)