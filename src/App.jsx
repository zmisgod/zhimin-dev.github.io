import React from 'react';
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom';
import MapIndex from './route/metro/map/index'
import MapGuide from './route/metro/guide/index'
import Toilet from './route/metro/toilet/sh/index'
import Home from './route/home/index'
import MetroMap from './route/metro/metro/index'
import IMaxPoster from './route/imax/poster/index'
import EParkTag from './route/epark/index'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="/toilet/sh" element={<Toilet />} />
          <Route path="/map" element={<MapIndex />} />
          <Route path="/imax/poster" element={<IMaxPoster />} />
          <Route path="/map/guide" element={<MapGuide />} />
          <Route path="/metro/metro" element={<MetroMap />} />
          <Route path="/epark" element={<EParkTag />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
