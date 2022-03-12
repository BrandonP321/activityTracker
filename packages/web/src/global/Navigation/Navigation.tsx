import React from 'react';
import { BrowserRouter as Router, Routes, Route, RouteProps } from "react-router-dom";
import LoadingContainer from '../components/LoadingContainer/LoadingContainer';
import loadable from "@loadable/component";

export default React.memo(function Navigation() {
  return (
    <Router>
      <Routes>
        <Route 
          path={"/dashboard/*"} 
          element={<AsyncComponent lazyComponentDynamicImport={() => import("../../Areas/Dashboard/DashboardArea")}/>}
        />
        <Route 
          path={"/auth/*"} 
          element={<AsyncComponent lazyComponentDynamicImport={() => import("../../Areas/Auth/AuthArea")}/>}
        />
      </Routes>
    </Router>
  )
})

interface IAsyncComponent extends Omit<RouteProps, "component"> {
  lazyComponentDynamicImport: () => Promise<any>
}

export const AsyncComponent = (props: IAsyncComponent) => {
  const { lazyComponentDynamicImport, ...rest } = props;

  const LazyComponent = loadable(lazyComponentDynamicImport, { fallback: <LoadingContainer loading /> })

  return (
    <LazyComponent {...rest}/>
  )
}