import React, { useEffect } from 'react';
import "destyle.css";
import './App.scss';
import Navigation from './global/Navigation/Navigation';
import { Responsive } from './features/responsive/Responsive';
import { useAppSelector } from './features/hooks';

function App() {
  useEffect(() => {
    Responsive.Initialize();
  }, [])

  return (
    <div className="App">
        <Navigation/>
    </div>
  );
}

export default App;
