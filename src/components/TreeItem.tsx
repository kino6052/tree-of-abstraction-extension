import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { red } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import * as React from "react";
import styled from "styled-components";
import { Tree } from "../services/TreeService";
import { EAction, ActionService } from "../services/ActionService";
import { MenuComponent } from "./Menu";
import { RemoveTreeDialog } from "./DialogInputs";

export const TreeItemWrapper = styled.div``;

// export const NoteItem = () => {
//   return <NoteItemWrapper />;
// };

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    margin: "24px 0"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
}));

export const TreeItem: React.SFC<{ tree: Tree }> = props => {
  const classes = useStyles();
  const actionService = ActionService.getService();
  const { tree = {} as Tree } = props;
  const { title } = tree as Tree;
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MenuComponent
              options={[
                {
                  text: "Remove",
                  onClick: () => {
                    actionService.next(EAction.OpenDialog, {
                      content: <RemoveTreeDialog tree={tree} />
                    });
                  }
                }
              ]}
            />
          </IconButton>
        }
        title={
          <div onClick={() => actionService.next(EAction.GoToTree, { tree })}>
            {title}
          </div>
        }
      />
    </Card>
  );
};
