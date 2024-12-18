import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Container, Form, FormGroup, Input, Label } from "reactstrap";
import AppNavbar from "./../AppNavbar.js";

const PhysicalProductEdit = () => {
  const initialFormState = {
    id: "",
    ean: "",
    name: "",
    sku: "",
    description: "",
    price: "",
  };
  const [physicalProduct, setPhysicalProduct] = useState(initialFormState);
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("jwtToken");
  useEffect(() => {
    if (id !== "new") {
      fetch(`/product/v1/physicalproduct/${id}`, {
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
        .then((data) => setPhysicalProduct(data));
    }
  }, [id, setPhysicalProduct]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPhysicalProduct({ ...physicalProduct, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetch(`/product/v1/physicalproduct`, {
      method: physicalProduct.id ? "PUT" : "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(physicalProduct),
    }).then((response) => {
      if (!response.ok) {
        if (response.status === 401 || response.status === 500) {
          // Unauthorized access
          alert("Unauthorized. Please login again.");
          localStorage.removeItem("jwtToken");
          window.location.href = "/"; // Redirect to loginnavigate("/");//
          throw new Error("Unauthorized access.");
        }
      }
    });
    setPhysicalProduct(initialFormState);
    navigate("/physicalproduct");
  };

  const title = (
    <h2>{physicalProduct.id ? "Edit Group" : "Add "} Physical Product</h2>
  );

  return (
    <div>
      <AppNavbar />
      <Container>
        {title}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              type="hidden"
              name="productId"
              id="productId"
              value={physicalProduct.productId || ""}
            />
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={physicalProduct.name || ""}
              onChange={handleChange}
              autoComplete="name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="ean">EAN</Label>
            <Input
              type="text"
              name="ean"
              id="ean"
              value={physicalProduct.ean || ""}
              onChange={handleChange}
              autoComplete="ean"
            />
          </FormGroup>
          <FormGroup>
            <Label for="sku">SKU</Label>
            <Input
              type="text"
              name="sku"
              id="sku"
              value={physicalProduct.sku || ""}
              onChange={handleChange}
              autoComplete="sku"
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="text"
              name="description"
              id="description"
              value={physicalProduct.description || ""}
              onChange={handleChange}
              autoComplete="description"
            />
          </FormGroup>
          <FormGroup>
            <Label for="price">Price</Label>
            <Input
              type="number"
              name="price"
              id="price"
              value={physicalProduct.price || ""}
              onChange={handleChange}
              autoComplete="price"
            />
          </FormGroup>
          <FormGroup>
            <Label for="quantity">Quantity</Label>
            <Input
              type="text"
              name="quantity"
              id="quantity"
              value={physicalProduct.quantity || ""}
              onChange={handleChange}
              autoComplete="quantity"
            />
          </FormGroup>
          <FormGroup>
            <Label for="colour">Colour</Label>
            <Input
              type="color"
              name="colour"
              id="colour"
              value={physicalProduct.colour || ""}
              onChange={handleChange}
              autoComplete="colour"
            />
          </FormGroup>
          <FormGroup>
            <Label for="size">Size</Label>
            <Input
              type="text"
              name="size"
              id="size"
              value={physicalProduct.size || ""}
              onChange={handleChange}
              autoComplete="size"
            />
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">
              Save
            </Button>{" "}
            <Button color="secondary" tag={Link} to="/physicalproduct">
              Cancel
            </Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  );
};

export default PhysicalProductEdit;
