import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Detail from "./Detail";
import List from "./List"
import Favorites from "./Favorites"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<List />} />
      <Route path="/detail" element={<Detail />} />
      <Route path="/list" element={<List />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
  </Router>,
  document.getElementById("root")
);
