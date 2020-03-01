import { BehaviorSubject } from "rxjs";

interface IDialog {
  title: string;
  message: string;
  isOpen: boolean;
  content?: React.SFC;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const DEFAULT_DIALOG_STATE = {
  title: "",
  message: "",
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

  openDialog = (
    title: string,
    message: string,
    content?: React.SFC,
    onSubmit?: () => void,
    onCancel?: () => void
  ) => {
    this.dialogSubject.next({
      title,
      message,
      isOpen: true,
      content,
      onSubmit,
      onCancel
    });
  };

  closeDialog = () => {
    this.dialogSubject.next(DEFAULT_DIALOG_STATE);
  };
}
