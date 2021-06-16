import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";

const searchForm = ({ searchIndex }) => {
  return (
    <div>
      <Typeahead
        id="searchTypeahead"
        onChange={(selected) => {
          // let data = searchIndex.search("bo");
          console.log(selected);
        }}
        options={[
          { id: 1, label: "Germany" },
          { id: 1, label: "Sweden" },
          { id: 1, label: "Netherlands" },
        ]}
      />
    </div>
  );
};

export default searchForm;
