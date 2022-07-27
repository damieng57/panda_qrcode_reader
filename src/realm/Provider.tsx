import React, {useContext, useState, useEffect, useRef} from 'react';
import Realm from 'realm';
import {IQrCode, IQrCodeContext} from '../types';
import {DecorationSchema, QrCodeSchema} from './models';
import {ObjectId} from 'bson';
import {useAtom} from 'jotai';
import {storeAtom} from '../utils/store';
import {message} from '../utils/helpers';

export const realmSchemaConfiguration = {
  schema: [QrCodeSchema, DecorationSchema],
  schemaVersion: 2,
};

const QrCodesContext = React.createContext<IQrCodeContext | null>(null);

export interface IProps {
  children?: JSX.Element;
}

const QrCodesProvider = ({children}: IProps): React.ReactElement => {
  const [resultSet, setResultSet] = useState<Realm.Results<Object> | []>([]);
  const [store, setStore] = useAtom(storeAtom);

  // Use a Ref to store the realm rather than the state because it is not
  // directly rendered, so updating it should not trigger a re-render as using
  // state would.
  let realmRef = useRef<Realm | null>(null);

  useEffect(() => {
    // open a realm for this particular project
    Realm.open(realmSchemaConfiguration)
      .then((realm: Realm) => {
        realmRef.current = realm;

        const result: Realm.Results<Object> = realm
          .objects('QrCode')
          .sorted('date', true);
        setResultSet(result);
        console.log('1. ResultSet update triggered first useEffect');
        realm.addListener('change', () => {
          setResultSet(resultSet);
          console.log('ResultSet update triggered inside the listener');
        });
      })
      .catch(e => console.error(e));

    return () => {
      // cleanup function
      const realm: Realm | null = realmRef.current;
      if (realm) {
        realm.removeListener('change', () => {
          realm.close();
          realmRef.current = null;
          setResultSet([]);
        });
      }
    };
  }, []);

  /* Create QrCode */
  /**
   *
   * @param rawQrCode
   * @returns
   */
  const create = (rawQrCode: IQrCode) => {
    const realm: Realm | null = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        // Create a new QrCode in the same partition -- that is, in the same project.
        realm.create('QrCode', rawQrCode);
      });
    } catch (error) {
      return message('error', 'Cannot create QrCode', error);
    }
  };

  /* Request QrCodes */
  /**
   *
   * @param query
   * @param sortedByDate
   * @param params
   * @returns
   */
  const get = (query: string, sortedByDate = true, ...params: any) => {
    const realm: Realm | null = realmRef.current;
    try {
      if (realm === null) return;
      const result: Realm.Results<Object> = realm
        .objects('QrCode')
        .sorted('date', sortedByDate)
        .filtered(query, ...params);
      setResultSet([...result]);
      console.log('ResultSet update triggered');
    } catch (error) {
      return message('error', 'Cannot filters these QrCodes', error);
    }
  };

  const getAll = (criteria = '') => {
    get('data CONTAINS[c] $0', true, criteria);
  };
  const getFavorites = (criteria = '') => {
    get('data CONTAINS[c] $0 && favorite == $1', true, criteria, true);
    console.log('Ready to trigger another action');
  };
  const getToDelete = (criteria = '') => {
    get('data CONTAINS[c] $0 && markedToDelete == $1', true, criteria, true);
  };

  /* Update QrCodes */
  /**
   *
   * @param _id
   * @param params
   * @returns
   *
   * Example
   * updateOne(_id, {favorites: true})
   *
   */
  const updateOne = (_id: ObjectId, params: Partial<IQrCode>) => {
    const realm: Realm | null = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        const qrCode = realm.objectForPrimaryKey('QrCode', _id);
        // Update some properties on the instance.
        // These changes are saved to the realm.
        for (const [key, value] of Object.entries(params)) {
          if (qrCode) {
            qrCode[key] = value;
          }
        }
      });
    } catch (error) {
      message('error', 'Cannot update QrCode', error);
    }
  };

  // All QrCodes marked as favorites will be unsetted
  const clearFavorites = () => {
    const realm: Realm | null = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        // Find qrCodes which are favorites.
        realm.objects('QrCode').update('favorite', false);
      });
    } catch (error) {
      return message('error', 'Cannot clear the QrCode elements', error);
    }
  };

  /* Delete QrCodes */
  /**
   *
   * @param qrcode
   * @returns
   */
  const deleteOne = (qrcode: IQrCode) => {
    const realm: Realm | null = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        realm.delete(qrcode);
      });
    } catch (error) {
      return message('error', 'Cannot delete this QrCode', error);
    }
  };

  const deleteAll = () => {
    const realm: Realm | null = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        realm.delete(realm.objects('QrCode'));
      });
    } catch (error) {
      return message('error', 'Cannot clear the QrCode elements', error);
    }
  };

  // Render the children within the TaskContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useQrCodes hook.
  return (
    <QrCodesContext.Provider
      value={{
        create,
        get,
        getAll,
        getFavorites,
        getToDelete,
        updateOne,
        deleteOne,
        deleteAll,
        clearFavorites,
        resultSet,
      }}>
      {children}
    </QrCodesContext.Provider>
  );
};

// The useQrCodes hook can be used by any descendant of the QrCodesProvider. It
// provides the QrCodes of the QrCodesProvider's project and various functions to
// create, update, and delete the QrCodes in that project.
const useQrCodes = () => {
  const resultSet = useContext(QrCodesContext);
  if (resultSet == null) {
    // an alert is not placed because this is an error for the developer not the user
    throw new Error('useQrCodes() called outside of a QrCodesProvider?');
  }
  return resultSet;
};

export {QrCodesProvider, useQrCodes};
