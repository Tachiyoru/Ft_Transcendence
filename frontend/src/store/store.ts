import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { combineReducers } from 'redux';
import { authReducer } from '../services';

export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
	auth: authReducer,
});

const store = configureStore({
	reducer: rootReducer,
});

export default store;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
