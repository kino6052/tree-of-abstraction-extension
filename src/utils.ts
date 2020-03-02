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
