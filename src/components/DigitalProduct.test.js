import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DigitalProduct from "./DigitalProduct";

global.fetch = jest.fn();

const renderComponent = () => {
  render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DigitalProduct />} />
      </Routes>
    </BrowserRouter>
  );
};

describe("DigitalProduct Component", () => {
  beforeEach(() => {
    localStorage.setItem("jwtToken", "fake-jwt-token");
    fetch.mockClear();
  });

  it("renders the component with no products", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderComponent();

    expect(screen.getByText(/Digital Product Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Digital Product/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/No products found/i)).not.toBeInTheDocument();
    });
  });

  it("fetches and displays products", async () => {
    const products = [
      {
        id: 1,
        ean: "123456789",
        name: "Product A",
        url: "http://example.com",
        description: "Description A",
        price: 99.99,
      },
      {
        id: 2,
        ean: "987654321",
        name: "Product B",
        url: "http://example.org",
        description: "Description B",
        price: 49.99,
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
      expect(screen.getByText("Product B")).toBeInTheDocument();
    });
  });

  it("handles unauthorized access during fetch", async () => {
    window.alert = jest.fn();

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    renderComponent();

    await waitFor(() => {
      expect(localStorage.getItem("jwtToken")).toBeNull();
      expect(window.location.href).toBe("/");
    });
  });

  it("removes a product when delete button is clicked", async () => {
    const products = [
      {
        id: 1,
        ean: "123456789",
        name: "Product A",
        url: "http://example.com",
        description: "Description A",
        price: 99.99,
      },
      {
        id: 2,
        ean: "987654321",
        name: "Product B",
        url: "http://example.org",
        description: "Description B",
        price: 49.99,
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    fetch.mockResolvedValueOnce({ ok: true });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
      expect(screen.getByText("Product B")).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByText(/Delete/i)[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("Product A")).not.toBeInTheDocument();
    });
  });

  it("handles unauthorized access during delete", async () => {
    const products = [
      {
        id: 1,
        ean: "123456789",
        name: "Product A",
        url: "http://example.com",
        description: "Description A",
        price: 99.99,
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/Delete/i);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(localStorage.getItem("jwtToken")).toBeNull();
      expect(window.location.href).toBe("/");
    });
  });
});
