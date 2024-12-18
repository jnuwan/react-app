import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DigitalProductEdit from "./DigitalProductEdit";

global.fetch = jest.fn();

const renderComponent = (id = "new") => {
  render(
    <BrowserRouter>
      <Routes>
        <Route path="/digitalproduct/:id" element={<DigitalProductEdit />} />
      </Routes>
    </BrowserRouter>,
    { route: `/digitalproduct/${id}` }
  );
};

describe("DigitalProductEdit Component", () => {
  beforeEach(() => {
    localStorage.setItem("jwtToken", "fake-jwt-token");
    fetch.mockClear();
  });

  it("renders the form with empty fields for a new product", async () => {
    renderComponent();

    expect(screen.getByLabelText(/Name/i)).toHaveValue("");
    expect(screen.getByLabelText(/EAN/i)).toHaveValue("");
    expect(screen.getByLabelText(/URL/i)).toHaveValue("");
    expect(screen.getByLabelText(/Description/i)).toHaveValue("");
    expect(screen.getByLabelText(/Price/i)).toHaveValue("");
  });

  it("fetches data and populates fields for an existing product", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "1",
        name: "Sample Product",
        ean: "123456789",
        url: "http://example.com",
        description: "A test product",
        price: 99.99,
      }),
    });

    renderComponent("1");

    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toHaveValue("Sample Product");
      expect(screen.getByLabelText(/EAN/i)).toHaveValue("123456789");
      expect(screen.getByLabelText(/URL/i)).toHaveValue("http://example.com");
      expect(screen.getByLabelText(/Description/i)).toHaveValue(
        "A test product"
      );
      expect(screen.getByLabelText(/Price/i)).toHaveValue(99.99);
    });
  });

  it("alerts and redirects to login when unauthorized", async () => {
    window.alert = jest.fn();
    const navigateSpy = jest.fn();

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    renderComponent("1");

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Unauthorized. Please login again."
      );
      expect(localStorage.getItem("jwtToken")).toBeNull();
    });
  });

  it("handles form input changes", async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "Test Name" },
    });
    fireEvent.change(screen.getByLabelText(/EAN/i), {
      target: { value: "123456" },
    });

    expect(screen.getByLabelText(/Name/i)).toHaveValue("Test Name");
    expect(screen.getByLabelText(/EAN/i)).toHaveValue("123456");
  });

  it("submits the form and redirects to /digitalproduct", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "New Product" },
    });
    fireEvent.change(screen.getByLabelText(/EAN/i), {
      target: { value: "987654321" },
    });
    fireEvent.change(screen.getByLabelText(/URL/i), {
      target: { value: "http://newurl.com" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "New Description" },
    });
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: 49.99 },
    });

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/product/v1/digitalproduct",
        expect.any(Object)
      );
    });
  });

  it("handles Cancel button click and redirects to /digitalproduct", async () => {
    renderComponent();

    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);

    expect(window.location.pathname).toBe("/digitalproduct");
  });
});
