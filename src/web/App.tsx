import React, { useEffect } from "react";
import { MemoryRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import "./App.css";
import { TopPage } from "../pages/topPage"
import { StopPage } from "../pages/stopPage";
import { HistoriesPage } from "../pages/historiesPage";


export const App = () => {
  return (
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/stopPage" element={<StopPage />} />
        <Route path="/historiesPage" element={<HistoriesPage />} />
      </Routes>
  );
};