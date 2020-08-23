import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';

import painterReducer, { importMap } from './factions';
// import defaultState from '../data/presets/mortal/default/map.json';

const rootReducer = combineReducers({
  painter: painterReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// store.dispatch(importMap(defaultState));

export default store;
