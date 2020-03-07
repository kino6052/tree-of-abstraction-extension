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
import { INote, NoteService } from "../services/NoteService";
import { MenuComponent } from "./Menu";
import { ActionService, EAction } from "../services/ActionService";
import { FormControl, TextField } from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import { unboxEvent } from "../utils";
import { RemoveNoteDialog } from "./DialogInputs";

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

export const NoteEditor: React.SFC<{ note: INote }> = ({ note }) => {
  const { id, title, html, labels, visible } = note;
  const actionService = ActionService.getService();
  const noteService = NoteService.getService();
  return (
    <div>
      <Card key={id}>
        <CardHeader
          action={
            <IconButton
              aria-label="settings"
              onClick={() => {
                actionService.next(EAction.EditNote, { id });
              }}
            >
              <Close />
            </IconButton>
          }
        />
        <FormControl fullWidth>
          <TextField
            label="Title"
            defaultValue={title}
            margin="normal"
            variant="outlined"
            value={title}
            onChange={e => {
              const title = unboxEvent(e);
              note.title = title;
              noteService.updateNotes();
            }}
          />
        </FormControl>
        {labels.map(label => (
          <Chip
            size="small"
            deleteIcon={<Close />}
            label={label.title}
            icon={<ShareIcon />}
            onDelete={() => {
              actionService.next(EAction.RemoveLabel, { note, label });
            }}
            color="primary"
          />
        ))}
        <FormControl fullWidth>
          <TextField
            label="HTML"
            multiline
            rows="4"
            defaultValue={html}
            margin="normal"
            variant="outlined"
            value={html}
            onChange={e => {
              const html = unboxEvent(e);
              note.html = html;
              noteService.updateNotes();
            }}
          />
        </FormControl>
      </Card>
    </div>
  );
};

export const NoteItem: React.SFC<{ note: INote }> = ({ note }) => {
  const { id, title, html, labels, visible } = note;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(true);
  const actionService = ActionService.getService();
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
              <MenuComponent
                options={[
                  {
                    text: "Edit",
                    onClick: () => {
                      actionService.next(EAction.EditNote, { id });
                    }
                  },
                  {
                    text: "Remove",
                    onClick: () => {
                      actionService.next(EAction.OpenDialog, {
                        content: <RemoveNoteDialog note={note} />
                      });
                    }
                  }
                ]}
              />
            </IconButton>
          }
          title={title}
          // subheader={title}
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
