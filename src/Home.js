import React from "react";
import "./App.css";
import AppNavbar from "./AppNavbar";
import { Container } from "reactstrap";
import MappingSuggest from "./components/MappingSuggest";
import SearchableTable from "./components/SearchableTable";

const Home = () => {
  return (
    <div>
      <AppNavbar />
      <Container fluid className="one-percent-margin">
        <div className="row">
          <div className="col-md-6">
            <SearchableTable />
          </div>
          <div className="col-md-6">
            <MappingSuggest />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12"></div>
        </div>
      </Container>
    </div>
  );
};

export default Home;
