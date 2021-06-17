import React, { useState } from "react";

const SearchForm = ({ searchIndex, centerOnMarker }) => {
  const [matchedIndexes, setMatchedIndexes] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");

  function searchInputChange(e) {
    setSearchInputValue(e.target.value);

    if (e.target.value.length !== 0) {
      let result = searchIndex.search(e.target.value, { enrich: true });
      let newResult = [];

      if (result.length === 0) {
        setMatchedIndexes([]);
      } else {
        for (const object of result[0].result) {
          newResult.push(object.doc);
        }
        setMatchedIndexes(newResult);
      }
    } else {
      setMatchedIndexes([]);
    }

    const allData = Object.values(searchIndex.store);

    for (const marker of allData) {
      if (
        marker.tags.findIndex(
          (item) => e.target.value.toLowerCase() === item.toLowerCase()
        ) !== -1 &&
        matchedIndexes.includes(marker) === false
      ) {
        setMatchedIndexes([...matchedIndexes, marker]);
      }
    }
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
          key={object.id}
          className="card"
          style={{ width: "400px", cursor: "pointer" }}
          onClick={() => centerOnMarker(object.position)}
        >
          <div className="card-body">
            <h5 className="card-title">{object.name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{object.category}</h6>
            <p className="card-text">{object.description}</p>
            <div>
              {object.tags.map((tag) => (
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
