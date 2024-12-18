import React, { useEffect, useState } from "react";
import { Table, Container, Form, FormGroup, Label, Input } from "reactstrap";
import AppNavbar from "./../AppNavbar.js";

const FilterMapping = () => {
  const [mapType, setMapType] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("jwtToken");
  const fetchData = () => {
    setLoading(true);
    fetch(`/product/v1/productmapping/${mapType}`, {
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
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleProductTypeChange = (e) => {
    setMapType(e.target.value);
  };

  useEffect(() => {
    if (mapType) {
      fetchData();
    }
  }, [mapType]);

  return (
    <div>
      <AppNavbar />
      <Container fluid className="one-percent-margin">
        <h3>Filter Products By Mapping</h3>
        <Form className="mt-3">
          <FormGroup>
            <Label for="mapTypeSelect">Select Filter</Label>
            <Input
              type="select"
              id="mapTypeSelect"
              value={mapType}
              onChange={handleProductTypeChange}
            >
              <option value="">-- Select Product Type --</option>
              <option value="mapped">Mapped Product</option>
              <option value="unmapped">Unmapped Product</option>
              <option value="suggested">Suggested Product</option>
            </Input>
          </FormGroup>
        </Form>

        {loading && <p>Loading...</p>}

        {!loading && products.length > 0 && (
          <Table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th>EAN</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.digitalProduct.id}>
                  <td>{product.digitalProduct.ean}</td>
                  <td>{product.digitalProduct.name}</td>
                  <td>{product.digitalProduct.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {!loading && products.length === 0 && mapType && (
          <p className="mt-4">No products found for the selected type.</p>
        )}
      </Container>
    </div>
  );
};

export default FilterMapping;
