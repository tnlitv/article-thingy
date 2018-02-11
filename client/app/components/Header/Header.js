import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <Link to="/">All</Link>
    <nav>
      <Link to="/fb/results">Results</Link>
    </nav>

    <hr />
  </header>
);

export default Header;
