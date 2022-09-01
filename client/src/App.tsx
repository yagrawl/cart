import React from 'react';
import { useAppSelector } from './app/hooks';
import { selectStep } from './reducers/flowSlice';
import { Header } from './components/header';
import Cart from './container/cart';
import Catalog from './container/catalog';
import Checkout from './container/checkout';

import './styles/main.scss';

function App() {
  const step = useAppSelector(selectStep);

  return (
    <div className='main'>
      <Header/>
      {
        (step === "catalog") ? (
          <div className='catalog'><Catalog/></div>
        ) : (
          <div className='checkout'><Checkout/></div>
        )
      }
      <div className='cart'><Cart/></div>
      <div className='clear'></div>
    </div>
  );
}

export default App;
