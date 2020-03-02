import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { HierarchyList, HierarchyItem } from "./HierarchyItem";
import { ActionService, EAction } from "../services/ActionService";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { Search } from "./Search";
import { ItemService } from "../services/ItemService";
import { useSharedState } from "../utils";

export const MainMenu: React.SFC = () => {
  const actionService = ActionService.getService();
  return (
    <React.Fragment>
      <div className={"toolbar"}>
        {/* <ArrowBack /> */}
        <Typography>Toolset</Typography>
      </div>
      <Divider />
      <HierarchyList>
        <HierarchyItem
          // @ts-ignore
          // onClick={() =>
          //   // actionService.next(EAction.ChangeLocation, { location: "/stuff" })
          // }
          text={"Trees"}
        />
      </HierarchyList>
    </React.Fragment>
  );
};

export const TreeMenu: React.SFC = () => {
  const actionService = ActionService.getService();
  const { hierarchyStateSubject } = ItemService.getService();
  const [hierarchy] = useSharedState(hierarchyStateSubject);
  return (
    <React.Fragment>
      <div className={"toolbar"}>
        <ArrowBack
          onClick={() =>
            actionService.next(EAction.ChangeLocation, { location: "/" })
          }
        />
        <Typography>Personal Library</Typography>
      </div>
      <Divider />
      <Search />
      <HierarchyList>
        {hierarchy.map(([item, indentation]) => (
          <HierarchyItem text={`${item.title}`} indentation={indentation} />
        ))}
      </HierarchyList>
    </React.Fragment>
  );
};
