import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

export default function Router() {
    return (
      <BrowserRouter>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
      </BrowserRouter>
    );
  }
  
