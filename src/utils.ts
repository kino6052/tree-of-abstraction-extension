import { BehaviorSubject, Subject } from "rxjs";
import { skip } from "rxjs/operators";
import { useState, useEffect } from "react";

export type Id = string;

export const useSharedState = <T>(
  subject: BehaviorSubject<T>
): [T, typeof useState] => {
  const [value, setState] = useState(subject.getValue());
  useEffect(() => {
    const sub = subject.pipe(skip(1)).subscribe(s => setState(s));
    return () => sub.unsubscribe();
  });
  const newSetState = (state: T) => subject.next(state);
  // @ts-ignore
  return [value, newSetState];
};

export const unboxEvent = (
  e: React.ChangeEvent | React.KeyboardEvent | React.MouseEvent
): string => {
  const {
    target: {
      // @ts-ignore
      value = ""
    } = {}
  } = e || {};
  return value;
};

export enum EPersistenceMessage {
  SaveTree = "SaveTree",
  SaveTreeIds = "SaveTreeIds",
  LoadTrees = "LoadTrees",
  TreesLoaded = "TreesLoaded"
}

export const sendMessage = <T>(message: EPersistenceMessage, data: T) => {
  document.dispatchEvent(
    new CustomEvent(message, {
      detail: data
    })
  );
};

export const generateUniqueId = (): string => `\
${Math.round(Math.random() * 10000)}-\
${Math.round(Math.random() * 10000)}-\
${Math.round(Math.random() * 10000)}-\
${Math.round(Math.random() * 10000)}`;

export const onUpload = (cb: (json: string) => void) => {
  const input = document.querySelector(".jsonUpload");
  console.warn("input");
  if (!input) return;
  // @ts-ignore
  input.onchange = function(evt) {
    try {
      let files = evt.target.files;
      if (!files.length) {
        alert("No file selected!");
        return;
      }
      let file = files[0];
      let reader = new FileReader();
      reader.onload = event => {
        console.warn("h");
        // @ts-ignore
        const { target: { result = "{}" } = {} } = event || {};
        try {
          console.warn("i");
          JSON.parse(result);
          cb(result);
        } catch (e) {
          console.warn("Could not parse JSON");
        }
      };
      reader.readAsText(file);
    } catch (err) {
      console.error(err);
    }
  };
};
