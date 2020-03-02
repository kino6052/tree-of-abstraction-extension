import { BehaviorSubject } from "rxjs";

interface IDialog {
  isOpen: boolean;
  content?: React.ReactNode;
}

const DEFAULT_DIALOG_STATE = {
  isOpen: false
};

export class DialogService {
  dialogSubject: BehaviorSubject<IDialog>;
  private static dialogService: DialogService = (null as unknown) as DialogService;

  constructor() {
    this.dialogSubject = new BehaviorSubject(DEFAULT_DIALOG_STATE);
    this.dialogSubject.subscribe(location => {
      console.warn(location);
    });
  }

  static getService = () => {
    if (DialogService.dialogService) return DialogService.dialogService;
    DialogService.dialogService = new DialogService();
    return DialogService.dialogService;
  };

  openDialog = (content?: React.ReactNode) => {
    this.dialogSubject.next({
      isOpen: true,
      content
    });
  };

  closeDialog = () => {
    this.dialogSubject.next(DEFAULT_DIALOG_STATE);
  };
}
