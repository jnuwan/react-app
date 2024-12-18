import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";

const AppNavbar = () => {
  const location = useLocation();

  const isActive = (path) => (location.pathname.startsWith(path) ? "active" : "");
  const token = localStorage.getItem("jwtToken");
  const user = <span>{token ? "Admin" : ""}</span>;

  return (
    <Navbar color="primary" dark expand="md" className="mb-4">
      <NavbarBrand>
        <b>Microservice full-stack demo application</b>
      </NavbarBrand>
      <Nav className="me-auto" navbar>
        <NavItem>
          <NavLink tag={Link} to="/home" className={isActive("/home")}>
            Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/physicalproduct" className={isActive("/physicalproduct")}>
            Physical Products
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/digitalproduct" className={isActive("/digitalproduct")}>
            Digital Products
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/filterMapping" className={isActive("/filterMapping")}>
            Filter
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/ordersimulate" className={isActive("/ordersimulate")}>
            Simulate
          </NavLink>
        </NavItem>
      </Nav>
      <Nav navbar>
        <NavItem>
          <NavLink tag={Link} to="/logout/logout" className="text-white">
            {user}
          </NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  );
};

export default AppNavbar;
