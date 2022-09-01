import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

type step = "catalog" | "checkout" | "complete";

export interface FlowState {
    step: step;
    orderId?: string;
}

const initialState: FlowState = {
    step: "catalog",
};

export const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    changeStep: (state, action) => {
        const newState = state;
        newState.step = action.payload.step;

        if(newState.step === "checkout") {
            newState.orderId = action.payload.orderId;
        }

        return newState;
    }
  },
});

export const { changeStep } = flowSlice.actions;
export const selectStep = (state: RootState) => state.flow.step;
export const selectOrderId = (state: RootState) => state.flow.orderId;

export default flowSlice.reducer;
