import { IExtendedItem, ItemService } from "./ItemService";
import { Id } from "../utils";
import { Subject, BehaviorSubject } from "rxjs";
import { takeWhile, filter } from "rxjs/operators";

export interface INote {
  id: Id;
  title: string;
  labels: IExtendedItem[];
  html: string;
  done: boolean;
  visible: boolean;
}

export class NoteService {
  private static noteService: NoteService;

  labelSubject = new Subject<{
    id: Id;
    cb: (note: INote) => void;
  }>();

  noteSubject = new Subject<{
    id: Id;
    cb: (note: INote) => void;
  }>();

  notesSubject = new Subject<{
    cb: (note: INote) => void;
  }>();

  notesStateSubject = new BehaviorSubject<INote[]>([]);

  selectedNoteStateSubject = new BehaviorSubject<{ note?: INote }>({});

  noteSearchStateSubject = new BehaviorSubject<string>("");

  editModeStateSubject = new BehaviorSubject<{ isEditing: boolean }>({
    isEditing: false
  });

  constructor() {}

  static getService = () => {
    if (NoteService.noteService) return NoteService.noteService;
    NoteService.noteService = new NoteService();
    return NoteService.noteService;
  };

  getNote = (id: Id, cb: (note: INote) => void) => {
    this.noteSubject.next({ id, cb });
  };

  noteSearch = (note: INote, query: string) => {
    const noteTitle = note.title.toLocaleLowerCase();
    const q = query.toLocaleLowerCase();
    if (noteTitle.includes(q)) return true;
    return false;
  };

  showAllNotesForItems = (items: IExtendedItem[], cb: () => void) => {
    const itemService = ItemService.getService();
    const noteService = NoteService.getService();
    const { id: rootId } = itemService.getRoot() || {};
    itemService.getAllChildren(items, items => {
      noteService.getAllNotes(cb, note => {
        const itemIds = items.map(i => i.id);
        note.visible = false;
        // Has a selected label
        note.labels.forEach(l => {
          // @ts-ignore
          if (itemIds.includes(l.id)) note.visible = true;
        });
        // Root is selected -> Show all notes
        // @ts-ignore
        if (itemIds.includes(rootId)) note.visible = true;
      });
    });
  };

  updateNotes = () =>
    this.getAllNotes(
      notes => {
        this.notesStateSubject.next(notes);
      },
      note => {
        const query = this.noteSearchStateSubject.getValue();
        // note.visible = this.noteSearch(note, query);
      }
    );

  addLabel = (note: INote, label: IExtendedItem) => {
    note.labels = [...note.labels, label].filter(
      (l, i, s) => s.indexOf(l) === i
    );
  };

  getAllNotes = (
    cb: (notes: INote[]) => void,
    forEachCb?: (note: INote) => void
  ) => {
    const result: INote[] = [];
    const stack: (INote | null)[] = [null];
    while (stack.length > 0) {
      stack.pop();
      this.notesSubject.next({
        cb: note => {
          if (forEachCb) forEachCb(note);
          // @ts-ignore
          const isInResult = result.map(i => i.id).includes(note.id);
          if (!isInResult) {
            result.push(note);
            stack.push(note);
          }
        }
      });
    }
    cb(result);
  };
}

export class Note implements INote {
  id: Id;
  title: string;
  labels: IExtendedItem[] = [];
  html = "";
  done: boolean = false;
  meta: {} = {};
  visible: boolean = true;
  constructor(title: string, id: Id, html = "", labels: IExtendedItem[] = []) {
    this.id = id;
    this.title = title;
    this.html = html;
    this.labels = labels;
    const noteService = NoteService.getService();
    const itemService = ItemService.getService();
    // Respond to getNodeById Requests
    noteService.noteSubject
      .pipe(
        takeWhile(() => !this.done),
        filter(({ id }) => id === this.id)
      )
      .subscribe(({ cb }) => cb(this));
    // Respond to getChildrenOfItem Requests
    noteService.labelSubject
      .pipe(
        takeWhile(() => !this.done),
        // @ts-ignore
        filter(({ id }) => id === this.labels.includes(id))
      )
      .subscribe(({ cb }) => cb(this));
    noteService.notesSubject
      .pipe(takeWhile(() => !this.done))
      .subscribe(({ cb }) => cb(this));
    itemService.removeSubject
      .pipe(takeWhile(() => !this.done))
      .subscribe(({ id }) => {
        if (!id) this.done = true; // Remove All
        this.labels = this.labels.filter(l => l.id !== id);
      });
  }
}
