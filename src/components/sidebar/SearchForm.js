import React, { useState } from "react";
import { useEffect } from "react";

import { categories } from "../../categories";
import useOnline from "../../hooks/useOnline";

const formatAddress = (address) => {
  let str = `${address.street}, ` || "";
  if (address.postcode) {
    str += address.postcode + " ";
  }
  if (address.city) {
    str += address.city;
  }
  return str;
};

const SearchForm = ({ searchIndex, centerOnMarker, initialized }) => {
  const [matchedIndexes, setMatchedIndexes] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const online = useOnline();

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

  useEffect(() => {
    if (!online && initialized) {
      const all = Object.values(searchIndex.store);
      setMatchedIndexes(all);
    }
  }, [online, searchIndex, initialized]);

  return (
    <div
      id="searchFormContainer"
      style={{ overflowY: "hidden" }}
      className="d-flex flex-column"
    >
      <div className="px-3 pt-1">
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
      <div className="p-3 pt-0" style={{ overflowY: "scroll" }}>
        {matchedIndexes.map((object) => (
          <div
            key={object.id}
            className="card"
            style={{ width: "100%", cursor: "pointer" }}
            onClick={centerOnMarker ? () => centerOnMarker(object) : () => {}}
          >
            <div className="card-body">
              <h5 className="card-title">{object.name}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                {categories.find((ctg) => ctg.key === object.category)?.name}
              </h6>
              <div className="card-text">
                <p>{object.description}</p>
                {!online && object.address ? (
                  <p>{formatAddress(object.address)}</p>
                ) : null}
              </div>
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
