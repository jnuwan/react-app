import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, ButtonGroup, Container, Table } from "reactstrap";
import AppNavbar from "./../AppNavbar.js";

const ProductMapping = () => {
  const [physicalProduct, setPhysicalProduct] = useState(null);
  const [digitalProduct, setDigitalProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { physicalProductId } = useParams();
  const { digitalProductId } = useParams();

  const token = localStorage.getItem("jwtToken");
  // Fetch physical product
  useEffect(() => {
    if (physicalProductId > 0) {
      fetch(`/product/v1/physicalproduct/${physicalProductId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401 || response.status === 500) {
              // Unauthorized access
              alert("Unauthorized. Please login again.");
              localStorage.removeItem("jwtToken");
              window.location.href = "/"; // Redirect to loginnavigate("/");//
              throw new Error("Unauthorized access.");
            }
          }
          return response.json();
        })
        .then((data) => setPhysicalProduct(data))
        .catch((error) =>
          console.error("Error fetching physical product:", error)
        );
    }
  }, [physicalProductId]);

  // Fetch initial digital product
  useEffect(() => {
    if (digitalProductId > 0) {
      fetch(`/product/v1/digitalproduct/${digitalProductId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401 || response.status === 500) {
              // Unauthorized access
              alert("Unauthorized. Please login again.");
              localStorage.removeItem("jwtToken");
              window.location.href = "/"; // Redirect to loginnavigate("/");//
              throw new Error("Unauthorized access.");
            }
          }
          return response.json();
        })
        .then((data) => setDigitalProduct(data))
        .catch((error) =>
          console.error("Error fetching digital product:", error)
        );
    }
  }, [digitalProductId]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      fetch(`/product/v1/searchproduct/digital?query=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401 || response.status === 500) {
              // Unauthorized access
              alert("Unauthorized. Please login again.");
              localStorage.removeItem("jwtToken");
              window.location.href = "/"; // Redirect to loginnavigate("/");//
              throw new Error("Unauthorized access.");
            }
          }
          return response.json();
        })
        .then((data) => setSearchResults(data))
        .catch((error) =>
          console.error("Error fetching search results:", error)
        );
    } else {
      setSearchResults([]);
    }
  };

  // Handle digital product selection
  const handleSelectDigitalProduct = (product) => {
    setDigitalProduct(product);
    setSearchResults([]);
    setSearchQuery("");
  };

  // Handle add mapping button click
  const handleAddMapping = () => {
    if (physicalProduct && digitalProduct) {
      const mappingData = {
        physicalProductId: physicalProduct.productId,
        digitalProductId: digitalProduct.id,
      };

      fetch("/product/v1/productmapping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(mappingData),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401 || response.status === 500) {
              // Unauthorized access
              alert("Unauthorized. Please login again.");
              localStorage.removeItem("jwtToken");
              window.location.href = "/"; // Redirect to loginnavigate("/");//
              throw new Error("Unauthorized access.");
            }
          }
        })
        .then((data) => alert("Mapping added successfully!"))
        .catch((error) => console.error("Error adding mapping:", error));
    }
  };

  return (
    <div>
      <AppNavbar />
      <Container fluid className="one-percent-margin">
        <div>
          <h3 className="mb-4">Product Mapping Manager</h3>

          <div className="row">
            <div className="col-sm-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Physical Product</h5>
                  {physicalProduct ? (
                    <div className="card p-3">
                      <p className="card-text">
                        {physicalProduct.name} - {physicalProduct.description} (
                        {physicalProduct.ean})
                      </p>
                      <ul className="list-group">
                        <li className="list-group-item">
                          Name: {physicalProduct.name}
                        </li>
                        <li className="list-group-item">
                          Description: {physicalProduct.description}
                        </li>
                        <li className="list-group-item">
                          EAN : {physicalProduct.ean}
                        </li>
                        <li className="list-group-item">
                          SKU : {physicalProduct.sku}
                        </li>
                        <li className="list-group-item">
                          Price: {physicalProduct.price}
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <p>Loading physical product...</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Digital Product</h5>
                  {digitalProduct ? (
                    <div className="card p-3">
                      <p className="card-text">
                        {digitalProduct.name} - {digitalProduct.description} (
                        {digitalProduct.ean})
                      </p>
                      <ul className="list-group">
                        <li className="list-group-item">
                          Name: {digitalProduct.name}
                        </li>
                        <li className="list-group-item">
                          Description: {digitalProduct.description}
                        </li>
                        <li className="list-group-item">
                          EAN: {digitalProduct.ean}
                        </li>
                        <li className="list-group-item">
                          URL: {digitalProduct.url}
                        </li>
                        <li className="list-group-item">
                          Price: {digitalProduct.price}
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <p>Search digital product for mapping...</p>
                  )}

                  <button
                    onClick={handleAddMapping}
                    className="btn btn-primary mt-3"
                  >
                    Add Mapping
                  </button>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div>
                <h4>Search Product</h4>
                <div className="row mb-4">
                  <div className="input-group rounded">
                    <input
                      type="text"
                      className="form-control rounded"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                {loading && <p>Loading...</p>}

                {error && <p style={{ color: "red" }}>Error: {error}</p>}

                {!loading && searchResults.length > 0 && (
                  <Table className="table">
                    <thead>
                      <tr>
                        <th width="15%">EAN</th>
                        <th width="10%">Name</th>
                        <th>Description</th>
                        <th width="30%">URL</th>
                        <th width="10%">&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((item) => (
                        <tr key={item.id}>
                          <td>{item.ean}</td>
                          <td>{item.name}</td>
                          <td>{item.description}</td>
                          <td>{item.url}</td>
                          <ButtonGroup>
                            <Button
                              className="btn btn-sm"
                              color="primary"
                              onClick={() => handleSelectDigitalProduct(item)}
                            >
                              Select
                            </Button>
                          </ButtonGroup>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}

                {!loading &&
                  searchResults.length === 0 &&
                  searchQuery.length > 2 && <p>No product found..</p>}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductMapping;
