import React, { useState } from "react";

const SearchForm = ({ searchIndex }) => {
  const [matchedIndexes, setMatchedIndexes] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");

  function searchInputChange(e) {
    setSearchInputValue(e.target.value);

    if (e.target.value.length !== 0) {
      let result = searchIndex.search(e.target.value, { enrich: true });

      if (result === []) {
        setMatchedIndexes([]);
      } else {
        setMatchedIndexes(result[0].result);
      }
    } else {
      setMatchedIndexes([]);
    }
  }

  function centerOnMarker(position) {
    console.log(position);
  }

  return (
    <div>
      <div>
        <input
          className="form-control"
          id="searchInput"
          aria-describedby="searchInput"
          placeholder="Marker oder Tags suchen"
          value={searchInputValue}
          onChange={searchInputChange}
        />
      </div>
      {matchedIndexes.map((object) => (
        <div
          key={object.doc.id}
          className="card"
          style={{ width: "400px", cursor: "pointer" }}
          onClick={() => centerOnMarker(object.doc.position)}
        >
          <div className="card-body">
            <h5 className="card-title">{object.doc.name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">
              {object.doc.category}
            </h6>
            <p className="card-text">{object.doc.description}</p>
            <div>
              {object.doc.tags.map((tag) => (
                <span
                  key={tag}
                  style={{ fontSize: "14px", margin: "1px" }}
                  className="badge rounded-pill bg-light text-dark"
                >
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    {tag}
                  </div>
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchForm;
