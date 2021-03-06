import AsyncStorage from '@react-native-community/async-storage';
import {atom, PrimitiveAtom} from 'jotai';
import {SetStateAction} from 'react';

type Storage<Value> = {
  getItem: (key: string) => Value | Promise<Value>;
  setItem: (key: string, newValue: Value) => void | Promise<void>;
};

const defaultStorage: Storage<unknown> = {
  getItem: async key => {
    const storedValue = await AsyncStorage.getItem(key)
      .then(value => {
        if (value === null || !value) {
          throw Error('Value cannot be null');
        }
        return JSON.parse(value);
      })
      .catch(error => {
        console.log(error);
      });
    return storedValue;
  },
  setItem: (key, newValue) => {
    AsyncStorage.setItem(key, JSON.stringify(newValue));
  },
};

export function atomWithStorage<Value>(
  key: string,
  initialValue: Value,
  storage: Storage<Value> = defaultStorage as Storage<Value>,
): PrimitiveAtom<Value> {
  const getInitialValue = () => {
    try {
      return storage.getItem(key);
    } catch {
      return initialValue;
    }
  };

  const baseAtom = atom(initialValue);

  baseAtom.onMount = setAtom => {
    Promise.resolve(getInitialValue()).then(setAtom);
  };

  const anAtom = atom(
    get => get(baseAtom),
    (get, set, update: SetStateAction<Value>) => {
      const newValue =
        typeof update === 'function'
          ? (update as (prev: Value) => Value)(get(baseAtom))
          : update;
      set(baseAtom, newValue);
      storage.setItem(key, newValue);
    },
  );

  return anAtom;
}
