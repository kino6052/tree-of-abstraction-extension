import * as React from "react";
import styled from "styled-components";
import { MoreVert } from "@material-ui/icons";
import { BehaviorSubject } from "rxjs";
import { Menu, MenuItem, Typography, IconButton } from "@material-ui/core";
import { useState } from "react";

const MenuWrapper = styled.div`
  display: flex;
`;

const handleClick = (
  event: React.MouseEvent<HTMLButtonElement>,
  setAnchorEl: (el: HTMLElement) => void
) => {
  setAnchorEl(event.currentTarget);
};

const handleClose = (setAnchorEl: (el: HTMLElement | null) => void) => {
  setAnchorEl(null);
};

interface Option {
  onClick: (e: InputEvent) => void;
  text: string;
}

type Options = Array<Option>;

export enum EMenuAction {
  Remove = "Remove",
  AddChild = "AddChild",
  Edit = "Edit"
}

export const CurrentMenuStateSubject = new BehaviorSubject<{
  id: string;
  action: EMenuAction;
}>({ id: '1', action: EMenuAction.Remove });

export const MenuComponent: React.SFC<{ id: string, options: Options }> = (props) => {
  const { options = [], id = "" } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <MenuWrapper>
      <IconButton
        classes={{ root: "menu-button" }}
        onClick={e => handleClick(e, setAnchorEl)}
      >
        <MoreVert />
      </IconButton>
      <Menu
        MenuListProps={{ style: { padding: 0 } }}
        style={{ padding: 0 }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => handleClose(setAnchorEl)}
      >
        <MenuItem key="placeholder" style={{ display: "none" }} />
        {options.map(option => {
          // const MenuIcon = mapMenuItemToIcon(option.text);
          return (
            <MenuItem
              style={{
                fontSize: "15px",
                margin: 0,
                padding: "12px"
              }}
              // key={option}
              onClick={e => {
                // CurrentMenuStateSubject.next({ id, option });
              }}
            >
              <Typography style={{ width: "160px" }}>{option}</Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </MenuWrapper>
  );
};
