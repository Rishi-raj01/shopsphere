import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import {AuthProvider} from "./context/auth"
import { SearchProvider } from './context/Search';
import { CartProvider } from './context/cart';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <AuthProvider>
  <SearchProvider>
 <CartProvider>

 
 <BrowserRouter>
  <App />
  </BrowserRouter>

 </CartProvider>
</SearchProvider>
 </AuthProvider>
 
);


