import React from 'react'
import { Routes, Route } from "react-router-dom";
import DashboardContent from '../../global/components/DashboardUI/DashboardContent/DashboardContent';
import DashOverview from './DashOverview/DashOverview';

export default function DashboardArea() {
  return (
    <DashboardContent>
      <Routes>
        <Route path={"/"} element={<DashOverview />} />
        <Route path={"/lists"} element={<DashOverview />} />
        <Route path={"/activities"} element={<DashOverview />} />
        <Route path={"/friends"} element={<DashOverview />} />
      </Routes>
    </DashboardContent>
  )
}