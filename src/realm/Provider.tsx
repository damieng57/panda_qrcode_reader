import React, {useContext, useState, useEffect, useRef} from 'react';
import Realm from 'realm';
import {EMessageCode, IQrCode, IQrCodeContext, IResultSetData} from '../types';
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

/**
 * Set a Realm provider
 * @param param
 * @returns
 */
const QrCodesProvider = ({children}: IProps): React.ReactElement => {
  const [resultSet, setResultSet] = useState<Object[]>([]);
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

        const _resultSet: Realm.Results<Object> = realm
          .objects('QrCode')
          .sorted('date', true);
        setResultSet([..._resultSet]);
        console.log('1. ResultSet update triggered first useEffect');
        realm.addListener('change', () => {
          console.log('2. ResultSet update triggered inside the listener');
          setResultSet([..._resultSet]);
        });
      })
      .catch(error => {
        const _error = message(
          EMessageCode.ERROR,
          'Cannot create QrCode',
          error,
        );
        throw new Error(_error.message);
      });

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

  /**
   * Create QrCode
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
      const _error = message(EMessageCode.ERROR, 'Cannot create QrCode', error);
      throw new Error(_error.message);
    }
  };

  /**
   * Request QrCodes
   * @param query
   * @param sortedByDate
   * @param params
   * @returns
   */
  const get = (
    query: string,
    sortedByDate = true,
    ...params: any
  ): IResultSetData | undefined => {
    const realm: Realm | null = realmRef.current;
    try {
      if (realm === null) return;
      const _resultSet: Realm.Results<Object> = realm
        .objects('QrCode')
        .sorted('date', sortedByDate)
        .filtered(query, ...params);
      return {
        resultSet: _resultSet,
        length: _resultSet.length,
        error: undefined,
      };
    } catch (error) {
      return {
        resultSet: [],
        length: 0,
        error: message(
          EMessageCode.ERROR,
          'Cannot filters these QrCodes',
          error,
        ),
      };
    }
  };

  /**
   * Get all items
   * @param criteria
   * @returns
   */
  const getAll = (criteria = ''): IResultSetData | undefined => {
    return get('data CONTAINS[c] $0', true, criteria);
  };

  /**
   * Get all items marked as favorties
   * @param criteria
   * @returns
   */
  const getFavorites = (criteria = ''): IResultSetData | undefined => {
    return get('data CONTAINS[c] $0 && favorite == $1', true, criteria, true);
  };

  /**
   * Get all items marked to delete
   * @param criteria
   * @returns
   */
  const getToDelete = (criteria = ''): IResultSetData | undefined => {
    return get(
      'data CONTAINS[c] $0 && markedToDelete == $1',
      true,
      criteria,
      true,
    );
  };

  /**
   * Update one item
   * @param _id
   * @param params
   * @returns
   * @example
   * ```
   * // Item with _id will change favorites attribute to true
   * updateOne(_id, {favorites: true});
   * ```
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
            // @ts-ignore
            qrCode[key] = value;
          }
        }
      });
    } catch (error) {
      const _error = message(
        EMessageCode.ERROR,
        'Cannot update this QrCode',
        error,
      );
      throw new Error(_error.message);
    }
  };

  /**
   * All QrCodes marked as favorites will be unsetted
   * Change the value of favorite attribute to false for all items
   * It's a bulk update
   * @returns
   */
  const clearFavorites = () => {
    const realm: Realm | null = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        // Find qrCodes which are favorites.
        realm.objects('QrCode').update('favorite', false);
      });
    } catch (error) {
      const _error = message(
        EMessageCode.ERROR,
        'Cannot update the favorties',
        error,
      );
      throw new Error(_error.message);
    }
  };

  /**
   * Delete a specific item
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
      const _error = message(
        EMessageCode.ERROR,
        'Cannot delete this QrCode',
        error,
      );
      throw new Error(_error.message);
    }
  };

  /**
   * Delete all items
   * @returns
   */
  const deleteAll = () => {
    const realm: Realm | null = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        realm.delete(realm.objects('QrCode'));
      });
    } catch (error) {
      const _error = message(
        EMessageCode.ERROR,
        'Cannot update the QrCodes',
        error,
      );
      throw new Error(_error.message);
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
        setResultSet,
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
