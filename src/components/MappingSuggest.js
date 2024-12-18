import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Table } from "reactstrap";
import { Link } from "react-router-dom";

const MappingSuggest = () => {
  const [physicalProducts, setPhysicalProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 3;

  const fetchProducts = (page) => {
    const token = localStorage.getItem("jwtToken");

    fetch(`/product/v1/suggestion?page=${page}&size=${pageSize}`, {
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
        setPhysicalProducts(data);
        setTotalPages(4);
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const physicalProductList = physicalProducts.map((product) => {
    return (
      <tr key={product.id}>
        <td>{product.physicalProduct.ean}</td>
        <td>{product.physicalProduct.name}</td>
        <td>{product.digitalProduct.name}</td>
        <td>
          {product.physicalProduct.description} -{" "}
          {product.digitalProduct.description}
        </td>
        <td>
          <ButtonGroup>
            <Button
              size="sm"
              color="primary"
              tag={Link}
              to={
                "/mapproduct/" +
                product.physicalProduct.productId +
                "/" +
                product.digitalProduct.id
              }
            >
              Map
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    );
  });

  return (
    <div className="mt-4">
      <div className="float-end"></div>
      <h3>Automatic Mapping Suggestions</h3>
      <Table className="mt-4 table" width="50%">
        <thead>
          <tr>
            <th width="10%">EAN</th>
            <th width="20%">Name</th>
            <th width="20%">Digital Name</th>
            <th>Description</th>
            <th width="10%">Actions</th>
          </tr>
        </thead>
        <tbody>{physicalProductList}</tbody>
      </Table>

      {physicalProductList.length > 0 && (
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item">
              <Button
                className="page-link"
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </Button>
            </li>
            <li className="page-item">
              <Button
                className="page-link"
                disabled={physicalProductList.length < 3}
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Next"
              >
                <span aria-hidden="true">&raquo;</span>
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};
export default MappingSuggest;
