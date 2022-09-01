import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import cartReducer from '../reducers/cartSlice';
import flowReducer from '../reducers/flowSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    flow: flowReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
