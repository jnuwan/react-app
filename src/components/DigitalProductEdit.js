import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Container, Form, FormGroup, Input, Label } from "reactstrap";
import AppNavbar from "./../AppNavbar.js";

const DigitalProductEdit = () => {
  const initialFormState = {
    id: "",
    ean: "",
    name: "",
    url: "",
    description: "",
    price: "",
  };

  const [digitalProduct, setDigitalProduct] = useState(initialFormState);
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("jwtToken");
  // handle fetch
  useEffect(() => {
    if (id !== "new") {
      fetch(`/product/v1/digitalproduct/${id}`, {
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
        .then((data) => setDigitalProduct(data));
    }
  }, [id, setDigitalProduct]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDigitalProduct({ ...digitalProduct, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetch(`/product/v1/digitalproduct`, {
      method: digitalProduct.id ? "PUT" : "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(digitalProduct),
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
    setDigitalProduct(initialFormState);
    navigate("/digitalproduct");
  };

  const title = (
    <h2>{digitalProduct.id ? "Edit Group" : "Add "} Digital Product</h2>
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
              name="id"
              id="id"
              value={digitalProduct.id || ""}
            />
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={digitalProduct.name || ""}
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
              value={digitalProduct.ean || ""}
              onChange={handleChange}
              autoComplete="ean"
            />
          </FormGroup>
          <FormGroup>
            <Label for="url">URL</Label>
            <Input
              type="text"
              name="url"
              id="url"
              value={digitalProduct.url || ""}
              onChange={handleChange}
              autoComplete="url"
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="text"
              name="description"
              id="description"
              value={digitalProduct.description || ""}
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
              value={digitalProduct.price || ""}
              onChange={handleChange}
              autoComplete="price"
            />
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">
              Save
            </Button>{" "}
            <Button color="secondary" tag={Link} to="/digitalproduct">
              Cancel
            </Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  );
};

export default DigitalProductEdit;
