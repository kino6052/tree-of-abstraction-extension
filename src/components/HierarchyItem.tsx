import * as React from "react";
import styled, { css } from "styled-components";
import Book from "@material-ui/icons/Book";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Remove from "@material-ui/icons/Remove";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
  Input
} from "@material-ui/core";
import { MenuComponent } from "./Menu";
import { ActionService, EAction } from "../services/ActionService";
import { IExtendedItem, EditableItem } from "../services/ItemService";

const HierarchyItemWrapper = styled.div<{
  visible: boolean;
  indentation: number;
}>`
  margin-left: ${({ indentation }) => indentation * 16}px;
  display: ${({ visible }) => (visible ? "flex" : "none")};
  flex-direction: row;
  .icon {
    margin-right: 8px;
    padding: 0;
    min-width: 0;
  }
`;

export const MainMenuHierarchyItem: React.SFC<{
  title: string;
  indentation?: number;
  collapsed?: boolean;
  isEditing?: boolean;
  onChange?: (e: React.ChangeEvent) => void;
}> = props => {
  const {
    title,
    indentation = 0,
    collapsed = false,
    isEditing = false,
    onChange,
    ...rest
  } = props;
  const actionService = ActionService.getService();
  return (
    <HierarchyItemWrapper {...rest} visible={true} indentation={indentation}>
      <ListItem>
        <ListItemIcon className="icon">
          <React.Fragment>
            {collapsed && <ExpandMore />}
            {!collapsed && <Remove />}
          </React.Fragment>
        </ListItemIcon>
        <ListItemIcon className="icon">
          <Book />
        </ListItemIcon>
        {!isEditing && (
          <ListItemText
            primary={title}
            // secondary={secondary ? "Secondary text" : null}
          />
        )}
        {isEditing && (
          <Input
            value={title}
            onChange={onChange}
            // secondary={secondary ? "Secondary text" : null}
          />
        )}
      </ListItem>
      {/* <MenuComponent
        options={[
          {
            text: "Edit",
            onClick: () => actionService.next(EAction.EditItem, { id })
          },
          {
            text: "Add Child",
            onClick: () => actionService.next(EAction.AddChild, { id })
          },
          {
            text: "Remove",
            onClick: () => actionService.next(EAction.RemoveItem, { id })
          }
        ]}
      /> */}
    </HierarchyItemWrapper>
  );
};

export const HierarchyItem: React.SFC<{
  item: EditableItem;
  indentation?: number;
}> = props => {
  const {
    item: { id, title, isCollapsed, isEditing, visible },
    indentation = 0,
    ...rest
  } = props;
  const actionService = ActionService.getService();
  return (
    <HierarchyItemWrapper {...rest} visible={visible} indentation={indentation}>
      <ListItem>
        <ListItemIcon className="icon">
          <div
            onClick={() => actionService.next(EAction.ToggleCollapse, { id })}
          >
            {isCollapsed && <ExpandMore />}
            {!isCollapsed && <Remove />}
          </div>
        </ListItemIcon>
        <ListItemIcon className="icon">
          <Book />
        </ListItemIcon>
        {!isEditing && (
          <ListItemText
            primary={title}
            // secondary={secondary ? "Secondary text" : null}
          />
        )}
        {isEditing && (
          <Input
            value={title}
            onChange={e =>
              actionService.next(EAction.HierarchyInputChange, { id, e })
            }
            // secondary={secondary ? "Secondary text" : null}
          />
        )}
      </ListItem>
      <MenuComponent
        options={[
          {
            text: "Edit",
            onClick: () => actionService.next(EAction.EditItem, { id })
          },
          {
            text: "Add Child",
            onClick: () => actionService.next(EAction.AddChild, { id })
          },
          {
            text: "Remove",
            onClick: () => actionService.next(EAction.RemoveItem, { id })
          }
        ]}
      />
    </HierarchyItemWrapper>
  );
};

export const HierarchyList: React.SFC<{
  children: React.ReactNode;
}> = props => {
  const { children } = props;
  return <List>{children}</List>;
};
