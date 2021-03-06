import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import {
  HierarchyList,
  HierarchyItem,
  MainMenuHierarchyItem
} from "./HierarchyItem";
import { ActionService, EAction } from "../services/ActionService";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Upload from "@material-ui/icons/CloudUpload";
import { Search } from "./Search";
import { ItemService, EditableItem } from "../services/ItemService";
import { useSharedState } from "../utils";
import { TreeService } from "../services/TreeService";
import IconButton from "@material-ui/core/IconButton";
import { MenuComponent } from "./Menu";
import styled from "styled-components";

export const MenuWrapper = styled.div`
  .toolbar {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 24px;
  }
`;

export const MainMenu: React.SFC = () => {
  return (
    <MenuWrapper>
      <div className={"toolbar"}>
        {/* <ArrowBack /> */}
        <Typography>Toolset</Typography>
      </div>
      <Divider />
      <HierarchyList>
        <MainMenuHierarchyItem title={"Trees"} />
      </HierarchyList>
    </MenuWrapper>
  );
};

export const TreeMenu: React.SFC = () => {
  const actionService = ActionService.getService();
  const { hierarchyStateSubject } = ItemService.getService();
  const [hierarchy] = useSharedState(hierarchyStateSubject);
  const {
    activeTree: { title = "", id = "" } = {},
    downloadTree
  } = TreeService.getService();
  return (
    <MenuWrapper>
      <div className={"toolbar"}>
        <IconButton>
          <ArrowBack
            onClick={() =>
              actionService.next(EAction.ChangeLocation, { location: "/" })
            }
          />
        </IconButton>
        <Typography>{title}</Typography>
        <MenuComponent
          options={[
            { text: "Download", onClick: () => downloadTree(id) },
            { text: "Upload", onClick: console.warn }
          ]}
        />
      </div>
      <Divider />
      <Search />
      <HierarchyList>
        {hierarchy.map(([item, indentation]) => (
          <HierarchyItem
            item={item as EditableItem}
            indentation={indentation}
          />
        ))}
      </HierarchyList>
    </MenuWrapper>
  );
};
