import { BehaviorSubject } from "rxjs";
import {
  Entry,
  EAction,
  IActionParam,
  TActionSubject,
  ActionService
} from "./ActionService";
import { filter } from "rxjs/internal/operators/filter";
import { HistoryService, EPath } from "./HistoryService";
import { DialogService } from "./DialogService";
import { TreeService } from "./TreeService";
import { ItemService, EditableItem } from "./ItemService";
import { generateUniqueId } from "../utils";
import { NoteService, Note, EditableNote } from "./NoteService";

const subscribe = <T extends keyof IActionParam>(
  subject: BehaviorSubject<Entry<keyof IActionParam>>,
  action: T,
  callback: (entry: Entry<T>) => void
) => {
  subject.pipe(filter(e => e[0] === action)).subscribe(callback);
};

export const Subscriptions = {
  onRemoveItem: (subject: TActionSubject) => {
    subscribe(subject, EAction.RemoveItem, ([_, { id }]) => {
      const itemService = ItemService.getService();
      itemService.remove(id);
      itemService.update();
    });
  },
  onRemoveNote: (subject: TActionSubject) => {
    subscribe(subject, EAction.RemoveNote, ([_, { id }]) => {
      const noteService = NoteService.getService();
      noteService.getNote(id, note => {
        note.done = true;
        noteService.updateNotes();
      });
    });
  },
  onRemoveTree: (subject: TActionSubject) => {
    subscribe(subject, EAction.RemoveTree, ([_, { id }]) => {
      const treeService = TreeService.getService();
      treeService.removeTree(id);
    });
  },
  onRemoveLabel: (subject: TActionSubject) => {
    subscribe(subject, EAction.RemoveLabel, ([_, { note, label }]) => {
      const noteService = NoteService.getService();
      note.labels = note.labels.filter(l => l.id !== label.id);
      noteService.updateNotes();
    });
  },
  onEditNote: (subject: TActionSubject) => {
    subscribe(subject, EAction.EditNote, ([_, { id }]) => {
      const noteService = NoteService.getService();
      noteService.getNote(id, (note: EditableNote) => {
        note.isEditing = !note.isEditing;
        noteService.selectedNoteStateSubject.next({
          note: note.isEditing ? note : undefined // This is really ugly
        });
        noteService.updateNotes();
      });
    });
  },
  onSelectItem: (subject: TActionSubject) => {
    subscribe(subject, EAction.SelectItem, ([_, { id }]) => {
      const noteService = NoteService.getService();
      const itemService = ItemService.getService();
      itemService.select(id);
      // Mote to a separate function
      const selectedIds = itemService.selectedItemStateSubject.getValue();
      // TODO: Move this logic into showAllNotesForItems
      itemService.getItems(selectedIds, items => {
        const { note } = noteService.selectedNoteStateSubject.getValue();
        if (note) {
          noteService.addLabel(note, items);
        }
        noteService.showAllNotesForItems(items, () => {
          itemService.update();
          noteService.updateNotes();
        });
      });
    });
  },
  onAddNote: (subject: TActionSubject) => {
    subscribe(subject, EAction.AddNote, ([_, { title, html }]) => {
      const itemService = ItemService.getService();
      const noteService = NoteService.getService();
      const selectedItems = itemService.selectedItemStateSubject.getValue();
      itemService.getItems(selectedItems, items => {
        new EditableNote(title, generateUniqueId(), html, items);
        noteService.updateNotes();
      });
    });
  },
  onToggleCollapse: (subject: TActionSubject) => {
    subscribe(subject, EAction.ToggleCollapse, ([_, { id }]) => {
      const itemService = ItemService.getService();
      const update = itemService.update;
      itemService.getItem(id, (item: EditableItem) => {
        item.isCollapsed = !item.isCollapsed;
        if (item.isCollapsed) {
          itemService.collapseAll(id, update);
        } else {
          itemService.uncollapseAll(item, update);
        }
      });
    });
  },
  onHierarchyInputChange: (subject: TActionSubject) => {
    subscribe(subject, EAction.HierarchyInputChange, ([_, { id, e }]) => {
      // @ts-ignore
      const { target: { value = "" } = {} } = e;
      const itemService = ItemService.getService();
      itemService.getItem(id, item => {
        item.title = value;
      });
      itemService.update();
    });
  },
  onEditItem: (subject: TActionSubject) => {
    subscribe(subject, EAction.EditItem, ([_, { id }]) => {
      const itemService = ItemService.getService();
      itemService.getItem(id, (item: EditableItem) => {
        item.isEditing = !item.isEditing;
        itemService.update();
      });
    });
  },
  onAddChild: (subject: TActionSubject) => {
    subscribe(subject, EAction.AddChild, ([_, { id }]) => {
      new EditableItem("Untitled", generateUniqueId(), id);
      const itemService = ItemService.getService();
      itemService.uncollapseChildren(id, () => {
        itemService.update();
      });
    });
  },
  onGoToTree: (subject: TActionSubject) => {
    subscribe(subject, EAction.GoToTree, ([_, { tree }]) => {
      const treeService = TreeService.getService();
      const historyService = HistoryService.getService();
      const itemService = ItemService.getService();
      const noteService = NoteService.getService();
      itemService.reset();
      treeService.setActiveTree(tree);
      const root = treeService.generateTree(tree);
      itemService.getHierarchy(root, hierarchy => {
        noteService.getAllNotes(notes => {
          noteService.notesStateSubject.next(notes);
          itemService.hierarchyStateSubject.next(hierarchy);
          historyService.next(EPath.Tree);
        });
      });
    });
  },
  onCreateNewTree: (subject: TActionSubject) => {
    subscribe(subject, EAction.CreateNewTree, ([_, { title }]) => {
      TreeService.getService().createTree(title);
    });
  },
  onHistoryChange: (subject: TActionSubject) => {
    subscribe(subject, EAction.ChangeLocation, ([_, { location }]) => {
      HistoryService.getService().next(location);
    });
  },
  onOpenDialog: (subject: TActionSubject) => {
    subscribe(subject, EAction.OpenDialog, ([_, { content }]) => {
      // console.warn("open");
      DialogService.getService().openDialog(content);
      // TODO: Implement
    });
  },
  onCloseDialog: (subject: TActionSubject) => {
    subscribe(subject, EAction.CloseDialog, ([_, {}]) => {
      // console.warn("cancel");
      DialogService.getService().closeDialog();
      // TODO: Implement
    });
  }
};
