import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface product {
  id: number,
  title: string,
  subtitle: string,
  price: number,
  image: string,
  quantity: number,
}

export interface CartState {
  cart: product[];
}

const initialState: CartState = {
  cart: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const cartState = state.cart;
      const newProduct = {
        id: action.payload.id,
        title: action.payload.title,
        subtitle: action.payload.subtitle,
        price: action.payload.price,
        image: action.payload.image,
        quantity: 1
      }

      cartState.push(newProduct);
      state.cart = cartState;
    },
    removeItem: (state, action) => {
      const cartState = state.cart.filter(product => (product.id !== action.payload.id));
      state.cart = cartState;
    },
    incrementItem: (state, action) => {
      const id = action.payload.id;
      const cartState = state.cart;

      cartState.forEach(item => {
        if(item.id === id) {
          item.quantity += 1;
        }
      });

      state.cart = cartState;
    },
    decrementItem: (state, action) => {
      const id = action.payload.id;
      const cartState = state.cart;

      cartState.forEach(item => {
        if(item.id === id) {
          item.quantity -= 1;
        }
      });

      state.cart = cartState;
    },
  },
});

export const { addItem, removeItem, incrementItem, decrementItem } = cartSlice.actions;
export const selectCart = (state: RootState) => state.cart.cart;

export default cartSlice.reducer;
