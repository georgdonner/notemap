import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";

const searchForm = (searchIndex) => {
  return (
    <div>
      <Typeahead
        onChange={(selected) => {
          console.log(selected);
        }}
        options={["Germany", "Netherlands", "Switzerland"]}
      />
    </div>
  );
};

export default searchForm;
