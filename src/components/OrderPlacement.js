import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Table,
} from "reactstrap";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import AppNavbar from "./../AppNavbar.js";

const OrderPlacement = () => {
  // List of products from backend
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(0);

  // Placed order details
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isDispatchEnabled, setIsDispatchEnabled] = useState(false);

  const token = localStorage.getItem("jwtToken");

  // Fetch products
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
            window.location.href = "/"; // Redirect to login
            throw new Error("Unauthorized access.");
          }
        }
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      const product = products.find((p) => p.productId == selectedProduct);
      if (product) {
        setAmount(product.price * quantity);
      }
    }
  }, [selectedProduct, quantity, products]);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  // Place order and send data to backend
  const placeOrder = () => {
    const orderData = {
      productId: selectedProduct,
      quantity: parseInt(quantity),
      amount: amount,
    };

    fetch("/product/v1/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401 || response.status === 500) {
            localStorage.removeItem("jwtToken");
            window.location.href = "/"; // Redirect to login
            throw new Error("Unauthorized access.");
          }
        }
        return response.json();
      })
      .then((data) => {
        setPlacedOrder(data);
        setIsOrderPlaced(true);
        // Connect to SSE for order placed notification

        const fetchData = async () => {
          await fetchEventSource(`/product/v1/order/payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
            onopen(res) {
              if (res.ok && res.status === 200) {
                console.log("Connection made ", res);
              } else if (
                res.status >= 400 &&
                res.status < 500 &&
                res.status !== 429
              ) {
                console.log("Client side error ", res);
              }
            },
            onmessage(event) {
              const order = JSON.parse(event.data);
              alert("Order status is " + order.status);
              setIsDispatchEnabled(true);
            },
            onclose() {
              console.log("Connection closed by the server");
            },
            onerror(err) {
              console.log("There was an error from server", err);
            },
          });
        };
        fetchData();
      })
      .catch((error) => console.error("Error placing order:", error));
  };

  // Dispatch order for delivery
  const dispatchOrder = () => {
    if (placedOrder) {
      fetch(`/product/v1/order/dispatch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(placedOrder),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          alert("Order dispatched successfully!");
          // Connect to SSE for dispatch notification

          const fetchData = async () => {
            await fetchEventSource(`/product/v1/order/${data.id}/status`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              onopen(res) {
                if (res.ok && res.status === 200) {
                  console.log("Connection made ", res);
                } else if (
                  res.status >= 400 &&
                  res.status < 500 &&
                  res.status !== 429
                ) {
                  console.log("Client side error ", res);
                }
              },
              onmessage(event) {
                console.log(event.data);
                const order = JSON.parse(event.data);
                alert("Order status is " + order.status);
                console.log(order);
                setIsDispatchEnabled(true);
              },
              onclose() {
                console.log("Connection closed by the server");
              },
              onerror(err) {
                console.log("There was an error from server", err);
              },
            });
          };
          fetchData();

          /*const eventSource = new EventSource(`/product/v1/order/${data.id}/dispatch-status`);
          eventSource.onmessage = (event) => {
            const dispatchStatus = JSON.parse(event.data);
            if (dispatchStatus.status === "Dispatched") {
              setPlacedOrder(null);
              setIsOrderPlaced(false);
              setIsDispatchEnabled(false);
            }
          };*/
        })
        .catch((error) => console.error("Error dispatching order:", error));
    }
  };

  return (
    <div>
      <AppNavbar />
      <Container fluid className="one-percent-margin">
        <h3>Order Placement</h3>
        <Form>
          <FormGroup>
            <Label for="productSelect">Select Product</Label>
            <Input
              type="select"
              id="productSelect"
              onChange={handleProductChange}
              value={selectedProduct}
            >
              <option value="">-- Select a Product --</option>
              {products.map((product) => (
                <option key={product.productId} value={product.productId}>
                  {product.name} : {product.description} - ${product.price}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="quantity">Quantity</Label>
            <Input
              type="number"
              id="quantity"
              value={quantity}
              min="1"
              onChange={handleQuantityChange}
            />
          </FormGroup>

          <h5>Total Amount: ${amount.toFixed(2)}</h5>

          <Button
            color="primary"
            onClick={placeOrder}
            disabled={!selectedProduct || isOrderPlaced}
          >
            {isOrderPlaced ? "Order Placed" : "Place Order"}
          </Button>
        </Form>

        {isOrderPlaced && (
          <div className="mt-4">
            <h4>Order Details</h4>
            <Table className="table table-bordered">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Quantity</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{placedOrder.id}</td>
                  <td>{placedOrder.quantity}</td>
                  <td>${placedOrder.amount}</td>
                </tr>
              </tbody>
            </Table>

            <Button
              color="success"
              onClick={dispatchOrder}
              disabled={!isDispatchEnabled}
            >
              Dispatch Order
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrderPlacement;
