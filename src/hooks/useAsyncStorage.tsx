import AsyncStorage from '@react-native-community/async-storage'
import { atom, PrimitiveAtom } from 'jotai'
import { SetStateAction } from 'react'

type Storage<Value> = {
  getItem: (key: string) => Value | Promise<Value>
  setItem: (key: string, newValue: Value) => void | Promise<void>
}

const defaultStorage: Storage<unknown> = {
  getItem: async (key) => {
    const storedValue = await AsyncStorage.getItem(key)
    if (storedValue === null) {
      throw new Error('no value stored')
    }
    return JSON.parse(storedValue)
  },
  setItem: (key, newValue) => {
    AsyncStorage.setItem(key, JSON.stringify(newValue))
  },
}

export function atomWithStorage<Value>(
  key: string,
  initialValue: Value,
  storage: Storage<Value> = defaultStorage as Storage<Value>
): PrimitiveAtom<Value> {
  const getInitialValue = () => {
    try {
      return storage.getItem(key)
    } catch {
      return initialValue
    }
  }

  const baseAtom = atom(initialValue)

  baseAtom.onMount = (setAtom) => {
    Promise.resolve(getInitialValue()).then(setAtom)
  }

  const anAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: SetStateAction<Value>) => {
      const newValue =
        typeof update === 'function'
          ? (update as (prev: Value) => Value)(get(baseAtom))
          : update
      set(baseAtom, newValue)
      storage.setItem(key, newValue)
    }
  )

  return anAtom
}



// import { useEffect, useState } from 'react'
// import AsyncStorage from '@react-native-community/async-storage';

// const useAsyncStorage = (key: string, initialValue: any) => {
//   const [data, setData] = useState(initialValue)
//   const [retrivedFromStorage, setRetrievedFromStorage] = useState(false)

//   useEffect(() => {
//     (async () => {
//       try {
//         const value = await AsyncStorage.getItem(key)
//         if (value) {
//             setData(JSON.parse(value) || initialValue)
//             setRetrievedFromStorage(true)
//         }
//       } catch (error) {
//         console.error('useAsyncStorage getItem error:', error)
//       }
//     })()
//   }, [key, initialValue])

//   const setNewData = async (value:any) => {
//     try {
//       await AsyncStorage.setItem(key, JSON.stringify(value))
//       setData(value)
//     } catch (error) {
//       console.error('useAsyncStorage setItem error:', error)
//     }
//   }

//   return [data, setNewData, retrivedFromStorage]
// }
// export default useAsyncStorage