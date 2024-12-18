import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import DigitalProduct from "./components/DigitalProduct";
import DigitalProductEdit from "./components/DigitalProductEdit";
import PhysicalProduct from "./components/PhysicalProduct";
import PhysicalProductEdit from "./components/PhysicalProductEdit";
import ProductMapping from "./components/ProductMapping";
import FilterMapping from "./components/FilterMapping";
import OrderPlacement from "./components/OrderPlacement";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/logout/:param" element={<Login />} />
        <Route exact path="/home" element={<Home />} />
        <Route path="/digitalproduct" exact={true} element={<DigitalProduct />} />
        <Route path="/digitalproduct/new" exact={true} element={<DigitalProductEdit />} />
        <Route path="/digitalproduct/:id" element={<DigitalProductEdit />} />
        <Route path="/physicalproduct" exact={true} element={<PhysicalProduct />} />
        <Route path="/physicalproduct/new" exact={true} element={<PhysicalProductEdit />} />
        <Route path="/physicalproduct/:id" element={<PhysicalProductEdit />} />
        <Route
          path="/mapproduct/:physicalProductId/:digitalProductId"
          element={<ProductMapping />}
        />
        <Route path="/filterMapping" exact={true} element={<FilterMapping />} />
        <Route path="/ordersimulate" exact={true} element={<OrderPlacement />} />
      </Routes>
    </Router>
  );
};

export default App;