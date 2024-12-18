import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Container, Table } from "reactstrap";
import AppNavbar from "./../AppNavbar.js";

const PhysicalProduct = () => {
  const [physicalProducts, setPhysicalProducts] = useState([]);

  const token = localStorage.getItem("jwtToken");
  useEffect(() => {
    fetch(`/product/v1/physicalproduct`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401 || response.status === 500) {
            localStorage.removeItem("jwtToken");
            window.location.href = "/";
            throw new Error("Unauthorized access.");
          }
        }
        return response.json();
      })
      .then((data) => {
        setPhysicalProducts(data);
      });
  }, []);

  const remove = async (id) => {
    await fetch(`/product/v1/physicalproduct/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401 || response.status === 500) {
            localStorage.removeItem("jwtToken");
            window.location.href = "/";
            throw new Error("Unauthorized access.");
          }
        }
      })
      .then(() => {
        let updatedProducts = [...physicalProducts].filter(
          (i) => i.productId !== id
        );
        setPhysicalProducts(updatedProducts);
      });
  };

  const physicalProductList = physicalProducts.map((product) => {
    return (
      <tr key={product.id}>
        <td>{product.ean}</td>
        <td>{product.sku}</td>
        <td>{product.name}</td>
        <td>
          <p style={{ backgroundColor: `{product.colour}` }}>
            {product.colour}
          </p>
        </td>
        <td>{product.price}</td>
        <td>{product.description}</td>
        <td>
          <ButtonGroup>
            <Button
              size="sm"
              color="primary"
              tag={Link}
              to={"/physicalproduct/" + product.productId}
            >
              Edit
            </Button>
            <Button
              size="sm"
              color="danger"
              onClick={() => remove(product.productId)}
            >
              Delete
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <AppNavbar />
      <Container fluid className="one-percent-margin">
        <div className="float-end"> </div>
        <h3>Physical Product Management</h3>
        <Button color="success" tag={Link} to="/physicalproduct/new">
          Add Physical Product
        </Button>
        <Table className="mt-4">
          <thead>
            <tr>
              <th width="10%">EAN</th>
              <th width="10%">SKU</th>
              <th width="10%">Name</th>
              <th width="10%">Colour</th>
              <th width="10%">Price</th>
              <th>Description</th>
              <th width="10%">Actions</th>
            </tr>
          </thead>
          <tbody>{physicalProductList}</tbody>
        </Table>
      </Container>
    </div>
  );
};

export default PhysicalProduct;
