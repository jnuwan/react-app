import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Container, Table } from "reactstrap";
import AppNavbar from "./../AppNavbar.js";

const DigitalProduct = () => {
  const [digitalProducts, setDigitalProducts] = useState([]);

  const token = localStorage.getItem("jwtToken");
  // handle fetch
  useEffect(() => {
    fetch(`/product/v1/digitalproduct`, {
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
          } else {
            throw new Error(`Error: ${response.statusText}`);
          }
        }
        return response.json();
      })
      .then((data) => {
        setDigitalProducts(data);
      });
  }, []);

  /* handle remove */
  const remove = async (id) => {
    await fetch(`/product/v1/digitalproduct/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
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
      })
      .then(() => {
        let updatedProducts = [...digitalProducts].filter((i) => i.id !== id);
        setDigitalProducts(updatedProducts);
      });
  };

  const digitalProductList = digitalProducts.map((product) => {
    return (
      <tr key={product.id}>
        <td>{product.ean}</td>
        <td>{product.name}</td>
        <td>{product.url}</td>
        <td>{product.price}</td>
        <td>{product.description}</td>
        <td>
          <ButtonGroup>
            <Button
              size="sm"
              color="primary"
              tag={Link}
              to={"/digitalproduct/" + product.id}
            >
              Edit
            </Button>
            <Button size="sm" color="danger" onClick={() => remove(product.id)}>
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
        <div className="float-end"></div>
        <h3>Digital Product Management</h3>
        <Button color="success" tag={Link} to="/digitalproduct/new">
          Add Digital Product
        </Button>
        <Table className="mt-4">
          <thead>
            <tr>
              <th width="10%">EAN</th>
              <th width="20%">Name</th>
              <th width="20%">URL</th>
              <th width="10%">Price</th>
              <th>Description</th>
              <th width="10%">Actions</th>
            </tr>
          </thead>
          <tbody>{digitalProductList}</tbody>
        </Table>
      </Container>
    </div>
  );
};

export default DigitalProduct;
