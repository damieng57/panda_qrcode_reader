import React, {useContext, useState, useEffect, useRef} from 'react';
import Realm from 'realm';
import {IQrCode} from '../types';
import {DecorationSchema, QrCodeSchema} from './models';
import {ObjectId} from 'bson';
import {useAtom} from 'jotai';
import {settingsAtom} from '../utils/helpers';

export const message = (
  status: string | undefined,
  _message: string,
  error?: any,
) => {
  return {
    status,
    _message,
    error,
  };
};

export const realmSchemaConfiguration = {
  schema: [QrCodeSchema, DecorationSchema],
  schemaVersion: 1,
};

const QrCodesContext = React.createContext(null);

export interface IProps {
  children?: JSX.Element;
}

const QrCodesProvider = ({children}: IProps) => {
  const [qrCodes, setQrCodes] = useState([]);
  const [settings] = useAtom(settingsAtom);
  const [updateTimestamp, setUpdateTimestamp] = useState([]);

  // Use a Ref to store the realm rather than the state because it is not
  // directly rendered, so updating it should not trigger a re-render as using
  // state would.
  const realmRef = useRef(null);

  useEffect(() => {
    // open a realm for this particular project
    Realm.open(realmSchemaConfiguration)
      .then(realm => {
        // @ts-ignore
        realmRef.current = realm;

        const qrCodes = realm.objects('QrCode').sorted('date', true);

        setQrCodes([...qrCodes]);
        realm.addListener('change', () => {
          console.log('update');
          setQrCodes([...qrCodes]);
        });
      })
      .catch(e => console.error(e));

    return () => {
      // cleanup function
      const realm = realmRef.current;
      if (realm) {
        realm.close();
        realmRef.current = null;
        setQrCodes([]);
      }
    };
  }, []);

  const createQrCode = (newQrCode: IQrCode) => {
    // @ts-ignore
    const realm: Realm = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        // Create a new task in the same partition -- that is, in the same project.
        realm.create('QrCode', newQrCode);
      });
    } catch (error) {
      return message('error', 'Cannot create QrCode', error);
    }
  };

  const updateQrCode = (_id: ObjectId) => {
    // @ts-ignore
    const realm: Realm = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        // Get a qrCode to update.
        const qrCode = realm.objectForPrimaryKey('QrCode', _id);
        // Update some properties on the instance.
        // These changes are saved to the realm.
        qrCode.favorite = !qrCode.favorite;
      });
    } catch (error) {
      return message('error', 'Cannot create QrCode', error);
    }
  };

  const deleteAllQrCodes = () => {
    // @ts-ignore
    const realm: Realm = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        realm.delete(realm.objects('QrCode'));
      });
    } catch (error) {
      return message('error', 'Cannot clear the QrCode elements', error);
    }
  };

  const deleteQrCode = (qrcode: IQrCode) => {
    // @ts-ignore
    const realm: Realm = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        realm.delete(qrcode);
      });
    } catch (error) {
      return message('error', 'Cannot delete this QrCode', error);
    }
  };

  const clearAllFavoritesQrCodes = () => {
    // @ts-ignore
    const realm: Realm = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        // Find qrCodes which are favorites.
        const qrCodes = realm.objects('QrCode').filtered('favorite == true');
        // Loop through to update.
        qrCodes.forEach(qrCode => {
          // All favorites to false.
          qrCode.favorite = false;
        });
      });
    } catch (error) {
      return message('error', 'Cannot clear the QrCode elements', error);
    }
  };

  const filterQrCodes = (
    criteria: string = '',
    favorite: boolean = settings.showFavorites || false,
  ) => {
    // @ts-ignore
    const realm: Realm = realmRef.current;

    let query = settings.showFavorites
      ? 'data CONTAINS[c] $0 && favorite == $1'
      : 'data CONTAINS[c] $0';

    try {
      let filteredQrCodes: any = [];
      filteredQrCodes = realm
        .objects('QrCode')
        .sorted('date', true)
        .filtered(query, criteria, favorite);
      setQrCodes([...filteredQrCodes]);
    } catch (error) {
      return message('error', 'Cannot filters these QrCodes', error);
    }
  };

  // Render the children within the TaskContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useTasks hook.
  return (
    <QrCodesContext.Provider
      value={{
        createQrCode,
        updateQrCode,
        deleteAllQrCodes,
        clearAllFavoritesQrCodes,
        deleteQrCode,
        filterQrCodes,
        qrCodes,
      }}>
      {children}
    </QrCodesContext.Provider>
  );
};

// The useTasks hook can be used by any descendant of the TasksProvider. It
// provides the tasks of the TasksProvider's project and various functions to
// create, update, and delete the tasks in that project.
const useQrCodes = () => {
  const qrCodes = useContext(QrCodesContext);
  if (qrCodes == null) {
    throw new Error('useQrCodes() called outside of a QrCodesProvider?'); // an alert is not placed because this is an error for the developer not the user
  }
  return qrCodes;
};

export {QrCodesProvider, useQrCodes};
