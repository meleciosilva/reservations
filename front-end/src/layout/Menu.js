import React from "react";

import { Link } from "react-router-dom";

function Menu() {
  return (
    <nav className="navbar navbar-dark navbar-expand-lg accentBackground">
      <div className="container-fluid" id="navBar">
        <Link className="navbar-brand" to="/dashboard"><h1>Periodic Tables</h1></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item px-3">
              <Link className="nav-link active" aria-current="page" to="/dashboard">
                <span className="oi oi-dashboard pr-2" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-item px-3">
              <Link className="nav-link" to="/search">
                <span className="oi oi-magnifying-glass pr-2" />
                <span>Search</span>
              </Link>
            </li>
            <li className="nav-item px-3">
              <Link className="nav-link" to="/reservations/new">
                <span className="oi oi-plus pr-2" />
                <span>New Reservation</span>
              </Link>
            </li>
            <li className="nav-item px-3">
              <Link className="nav-link" to="/tables/new">
                <span className="oi oi-layers pr-2" />
                <span>New Table</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Menu;
