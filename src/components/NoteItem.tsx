import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import Chip from "@material-ui/core/Chip";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import { red } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ShareIcon from "@material-ui/icons/Share";
import clsx from "clsx";
import * as React from "react";
import styled from "styled-components";
import { INote } from "../services/NoteService";

export const NoteItemWrapper = styled.div``;

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

export const NoteItem: React.SFC<{ note: INote }> = ({ note }) => {
  const { id, title, html, labels, visible } = note;
  console.warn(labels);
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div style={{ display: visible ? "flex" : "none" }}>
      <Card className={classes.root} key={id}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              R
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={title}
          subheader={title}
        />
        <CardActions disableSpacing>
          {labels.map(l => (
            <Chip
              size="small"
              label={l.title}
              icon={<ShareIcon />}
              // onDelete={handleDelete}
              color="primary"
            />
          ))}
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography>
              <div dangerouslySetInnerHTML={{ __html: html }}></div>
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
};
