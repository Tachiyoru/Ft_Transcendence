// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from '../services/UserSlice';

const rootReducer = combineReducers({
    user: userReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);