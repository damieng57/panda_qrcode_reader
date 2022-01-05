import React, {useContext, useState, useEffect, useRef} from 'react';
import Realm from 'realm';
import {IQrCode} from '../types';
import {DecorationSchema, QrCodeSchema} from './models';
import {ObjectId} from 'bson';

export const message = (
  status: string = 'undefined',
  message: string,
  error?: any,
) => {
  return {
    status,
    message,
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

  // Use a Ref to store the realm rather than the state because it is not
  // directly rendered, so updating it should not trigger a re-render as using
  // state would.
  const realmRef = useRef(null);

  useEffect(() => {
    // open a realm for this particular project
    Realm.open(realmSchemaConfiguration).then(realm => {
      // @ts-ignore
      realmRef.current = realm;

      const qrCodes = realm.objects('QrCode') //.sorted(true) doesn't work;
      setQrCodes([...qrCodes]);
      qrCodes.addListener(() => {
        setQrCodes([...qrCodes]);
      });
    }).catch(
      e => console.error(e)
    );

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
        // Create a new task in the same partition -- that is, in the same project.
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
        // Create a new task in the same partition -- that is, in the same project.
        realm.delete(qrcode);
      });
    } catch (error) {
      return message('error', 'Cannot delete this QrCode', error);
    }
  };

  const deleteAllFavoritesQrCodes = () => {
    // @ts-ignore
    const realm: Realm = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        // Find qrCodes which are favorites.
        const qrCodes = realm.objects("QrCode").filtered('favorite == true');
        // Loop through to update.
        qrCodes.map((qrCode) => {
          // Give all puppies to Ali.
          qrCode.favorite = false;
        });

      });
    } catch (error) {
      return message('error', 'Cannot clear the QrCode elements', error);
    }
  };

  const filterQrCodes = (criteria: string = '', favorite: boolean = false) => {
    // @ts-ignore
    const realm: Realm = realmRef.current;

    try {
      let filteredQrCodes: any = [];
      if (favorite) {
        filteredQrCodes = realm
          .objects('QrCode')
          .filtered(
            'data CONTAINS[c] $0 && favorite == $1',
            criteria,
            favorite,
          );
      } else {
        filteredQrCodes = realm
          .objects('QrCode')
          .filtered(
            'data CONTAINS[c] $0',
            criteria,
            favorite,
          );
      }
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
        deleteAllFavoritesQrCodes,
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
