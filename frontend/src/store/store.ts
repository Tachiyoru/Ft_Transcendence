// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from '../services/UserSlice';
import selectedChannelReducer from '../services/selectedChannelSlice'; // Assurez-vous que le chemin est correct
import thunk from 'redux-thunk';

export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
    user: userReducer,
    selectedChannelId: selectedChannelReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'qrcode'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
});

export const persistor = persistStore(store);