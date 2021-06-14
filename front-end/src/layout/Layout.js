import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

function Layout() {
  return (
    <div className="container-fluid">
      <div className="row h-100">
          <Menu />
        <div className="col px-4 pt-3">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;
