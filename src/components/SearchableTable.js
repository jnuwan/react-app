import React, { useState } from "react";
import { Button, ButtonGroup, Table } from "reactstrap";
import { Link } from "react-router-dom";

const SearchableTable = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("jwtToken");
  const handleSearch = async (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery.length > 2) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/product/v1/searchproduct/physical?page=0&size=10&query=${encodeURIComponent(
            searchQuery
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          if (response.status === 401 || response.status === 500) {
            localStorage.removeItem("jwtToken");
            window.location.href = "/";
            throw new Error("Unauthorized access.");
          }
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setData([]);
    }
  };

  return (
    <div className="mt-4">
      <h3>Search Product</h3>

      <div className="input-group rounded">
        <input
          type="text"
          className="form-control rounded"
          placeholder="Search"
          value={query}
          onChange={handleSearch}
        />
      </div>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && data.length > 0 && (
        <Table className="mt-4">
          <thead>
            <tr>
              <th width="10%">EAN</th>
              <th width="30%">Name</th>
              <th width="15%">Type</th>
              <th>Description</th>
              <th width="10%">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.ean}</td>
                <td>{item.name}</td>
                <td>{item.productType}</td>
                <td>{item.description}</td>
                <ButtonGroup>
                  <Button
                    size="sm"
                    color="primary"
                    tag={Link}
                    to={"/mapproduct/" + item.id + "/-1"}
                  >
                    Map
                  </Button>
                </ButtonGroup>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {!loading && data.length > 10 && (
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      )}

      {!loading && data.length === 0 && query.length > 2 && (
        <p>No product found..</p>
      )}
    </div>
  );
};

export default SearchableTable;
