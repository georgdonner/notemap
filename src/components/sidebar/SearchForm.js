import React, { useState, useEffect } from "react";

import { categories } from "../../categories";

const SearchForm = ({ searchIndex, centerOnMarker }) => {
  const [matchedIndexes, setMatchedIndexes] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [heightOfDescriptionForm, setHeightOfDescriptionForm] = useState(0);

  useEffect(() => {
    let searchFormContainer = document.getElementById("searchFormContainer");

    if (searchFormContainer !== null) {
      setHeightOfDescriptionForm(
        searchFormContainer.previousSibling.offsetHeight - 1
      );
      console.log(heightOfDescriptionForm);
    }
  }, []);

  function searchInputChange(e) {
    setSearchInputValue(e.target.value);

    if (e.target.value.length !== 0) {
      let result = searchIndex.search(e.target.value, { enrich: true });
      let newResult = [];

      if (result.length === 0) {
        setMatchedIndexes([]);
      } else {
        for (const fieldObject of result) {
          for (const object of fieldObject.result) {
            if (!newResult.includes(object.doc)) {
              newResult.push(object.doc);
            }
          }
        }
        setMatchedIndexes(newResult);
      }
    } else {
      setMatchedIndexes([]);
    }
  }

  return (
    <div id="searchFormContainer" style={{ zIndex: 1 }}>
      <div
        className="p-3 pb-0"
        style={{
          position: "sticky",
          top: heightOfDescriptionForm,
          zIndex: 3,
          background: "white",
        }}
      >
        <input
          autoComplete="off"
          className="form-control"
          id="searchInput"
          aria-describedby="searchInput"
          placeholder="Marker oder Tags suchen"
          value={searchInputValue}
          onChange={searchInputChange}
          style={{ width: "100%" }}
        />
      </div>
      <div className="p-3 pt-0">
        {matchedIndexes.map((object) => (
          <div
            key={object.id}
            className="card"
            style={{ width: "100%", cursor: "pointer" }}
            onClick={() => centerOnMarker(object)}
          >
            <div className="card-body">
              <h5 className="card-title">{object.name}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                {categories.find((ctg) => ctg.key === object.category)?.name}
              </h6>
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
    </div>
  );
};

export default SearchForm;
