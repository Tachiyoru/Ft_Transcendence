// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from '../services/UserSlice';
import chatReducer from '../services/chatSlice';
import selectedChannelReducer from '../services/selectedChannelSlice'; // Assurez-vous que le chemin est correct
import thunk from 'redux-thunk';

export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
    user: userReducer,
    selectedChannelId: selectedChannelReducer,
    chat: chatReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'selectedChannelId'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
});

export const persistor = persistStore(store);