import React from 'react';
import { Header } from './components/header';
import Cart from './container/cart';
import Catalog from './container/catalog';

import './styles/main.scss';

function App() {
  return (
    <div className='main'>
      <Header/>
      <div className='catalog'><Catalog/></div>
      <div className='cart'><Cart/></div>
      <div className='clear'></div>
    </div>
  );
}

export default App;
