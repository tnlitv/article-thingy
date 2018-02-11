import React, { Component } from 'react';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const App = ({ children }) => (
  <div className='content'>
    <Header />

    <main>
      {children}
    </main>

  </div>
);

export default App;
