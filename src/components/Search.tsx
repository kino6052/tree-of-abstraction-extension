import * as React from "react";
import { TextField } from "@material-ui/core";
import styled from "styled-components";

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  & .root {
    width: 90%;
    margin: 24px auto !important;
  }
`;

export const Search: React.SFC = () => {
  return (
    <SearchWrapper>
      <TextField
        classes={{ root: "root" }}
        size="small"
        id="outlined-search"
        label="Search field"
        type="search"
        variant="outlined"
      />
    </SearchWrapper>
  );
};
