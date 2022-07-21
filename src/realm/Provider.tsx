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
  schemaVersion: 2,
};

const QrCodesContext = React.createContext(null);

export interface IProps {
  children?: JSX.Element;
}

const QrCodesProvider = ({children}: IProps) => {
  const [resultSet, setResultSet] = useState([]);
  const [settings, setSettings] = useAtom(settingsAtom);

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

        const resultSet = realm.objects('QrCode').sorted('date', true);

        setResultSet(resultSet);
        realm.addListener('change', () => {
          setResultSet(resultSet);
        });
      })
      .catch(e => console.error(e));

    return () => {
      // cleanup function
      const realm = realmRef.current;
      if (realm) {
        realm.removeListener('change');
        realm.close();
        realmRef.current = null;
        setResultSet([]);
      }
    };
  }, []);

  const createQrCode = (newQrCode: IQrCode) => {
    // @ts-ignore
    const realm: Realm = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        // Create a new QrCode in the same partition -- that is, in the same project.
        realm.create('QrCode', newQrCode);
      });
    } catch (error) {
      return message('error', 'Cannot create QrCode', error);
    }
  };

  const updateQrCode = (_id: ObjectId, callback: (value?: any) => void) => {
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
      // Calback should update the number of favorite
      if (callback && typeof callback == 'function') {
        callback();
      }
    } catch (error) {
      return message('error', 'Cannot update QrCode', error);
    }
  };

  const updateQrCodeToDelete = (
    _id: ObjectId,
    callback: (value?: any) => void,
  ) => {
    // @ts-ignore
    const realm: Realm = realmRef.current;

    try {
      if (realm === null) {
        return undefined;
      }
      realm.write(() => {
        // Get a qrCode to update.
        const qrCode: IQrCode | undefined = realm.objectForPrimaryKey(
          'QrCode',
          _id,
        );
        // Update some properties on the instance.
        // These changes are saved to the realm.
        if (qrCode) {
          qrCode.markedToDelete = !qrCode?.markedToDelete;
        }
      });
      // Calback should update the number of numberOfItemsMarkedToDeletion
      if (callback && typeof callback == 'function') {
        callback();
      }
      // setSettings({
      //   ...settings,
      //   numberOfItemsMarkedToDeletion: realm
      //     .objects('QrCode')
      //     .filtered('markedToDelete == true').length,
      // });
    } catch (error) {
      return message('error', 'Cannot update QrCode', error);
    }
  };

  const deleteAllQrCodes = (callback: (value?: any) => void) => {
    // @ts-ignore
    const realm: Realm = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        realm.delete(realm.objects('QrCode'));
      });
      // Calback should update the number of numberOfFavorites to 0
      if (callback && typeof callback == 'function') {
        callback();
      }
    } catch (error) {
      return message('error', 'Cannot clear the QrCode elements', error);
    }
  };

  const deleteQrCode = (qrcode: IQrCode, callback: (value?: any) => void) => {
    // @ts-ignore
    const realm: Realm = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        realm.delete(qrcode);
      });
      // Calback should update the number of numberOfFavorites.length
      if (callback && typeof callback == 'function') {
        callback();
      }
    } catch (error) {
      return message('error', 'Cannot delete this QrCode', error);
    }
  };

  const clearAllFavoritesQrCodes = (callback: (value?: any) => void) => {
    // @ts-ignore
    const realm: Realm = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        // Find qrCodes which are favorites.
        realm.objects('QrCode').update('favorite', false);
      });
    } catch (error) {
      return message('error', 'Cannot clear the QrCode elements', error);
    }
    // Calback should update the number of numberOfFavorites to 0
    if (callback && typeof callback == 'function') {
      callback();
    }
  };

  const clearAllMarkedToDeleteQrCodes = (callback: (value?: any) => void) => {
    // @ts-ignore
    const realm: Realm = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        // Find qrCodes which are favorites.
        realm.objects('QrCode').update('markedToDelete', false);
      });
      // Calback should update the number of numberOfItemsMarkedToDeletion to 0
      if (callback && typeof callback == 'function') {
        callback();
      }
    } catch (error) {
      return message('error', 'Cannot clear the QrCode elements', error);
    }
  };

  const deleteAllMarkedQrCodes = (callback: (value?: any) => void) => {
    // @ts-ignore
    const realm: Realm = realmRef.current;
    try {
      if (realm === null) return;
      realm.write(() => {
        realm.delete(
          realm.objects('QrCode').filtered('markedToDelete == true'),
        );
      });
      // Keep number of favorites updated
      setSettings({
        ...settings,
        numberOfFavorites: realm.objects('QrCode').filtered('favorite == true'),
        numberOfItemsMarkedToDeletion: 0,
      });
    } catch (error) {
      return message('error', 'Cannot clear the QrCode elements', error);
    }
  };
  interface IGetQrCodes {
    result: [];
    message: (
      status: string | undefined,
      _message: string,
      error?: any,
    ) => void;
    all: () => void;
    query: (criteria: string) => void;
    favorites: (criteria: string) => void;
    markedToDelete: (criteria: string) => void;
  }

  const qrQodes: IQrCodesManager = {
    result: [],
    message: (status: string | undefined, _message: string, error?: any) => {
      return {
        status,
        _message,
        error,
      };
    },
    /* Create QrCode */
    create: (newQrCode: IQrCode) => {
      // @ts-ignore
      const realm: Realm = realmRef.current;

      try {
        if (realm === null) return;
        realm.write(() => {
          // Create a new QrCode in the same partition -- that is, in the same project.
          realm.create('QrCode', newQrCode);
        });
      } catch (error) {
        this?.message('error', 'Cannot create QrCode', error);
      }
    },

    /* Query QrCodes */
    query: (query: string, sortedByDate = true, ...params: any): void => {
      // @ts-ignore
      const realm: Realm = realmRef?.current;
      try {
        this.result = realm
          ?.objects('QrCode')
          .sorted('date', sortedByDate)
          .filtered(query, ...params);
      } catch (error) {
        this?.message('error', 'Cannot filters these QrCodes', error);
      }
    },
    getAll: () => {
      this?.query('data');
    },
    getFavorites: (criteria = '') => {
      this?.query(
        'data CONTAINS[c] $0 && favorite == $1',
        true,
        criteria,
        true,
      );
    },
    getMarkedToDelete: (criteria = '') => {
      this?.query(
        'data CONTAINS[c] $0 && markedToDelete == $1',
        true,
        criteria,
        true,
      );
    },

    /* Update QrCodes */

    updateOne: (
      _id: ObjectId,
      params: Partial<IQrCode>,
      callback: (value?: any) => void,
    ) => {
      // @ts-ignore
      const realm: Realm = realmRef.current;

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
        // Calback should update the number of favorite
        if (callback && typeof callback == 'function') {
          callback();
        }
      } catch (error) {
        this?.message('error', 'Cannot update QrCode', error);
      }
    },

    /* Delete QrCodes */
    deleteOne: (callback: (value?: any) => void) => {
      // @ts-ignore
      const realm: Realm = realmRef.current;

      try {
        if (realm === null) return;
        realm.write(() => {
          realm.delete(realm.objects('QrCode'));
        });
        // Calback should update the number of numberOfFavorites to 0
        if (callback && typeof callback == 'function') {
          callback();
        }
      } catch (error) {
        this?.message('error', 'Cannot clear the QrCode elements', error);
      }
    },

    deleteAll: (callback: (value?: any) => void) => {
      // @ts-ignore
      const realm: Realm = realmRef.current;

      try {
        if (realm === null) return;
        realm.write(() => {
          realm.delete(realm.objects('QrCode'));
        });
        // Calback should update the number of numberOfFavorites to 0
        if (callback && typeof callback == 'function') {
          callback();
        }
      } catch (error) {
        this?.message('error', 'Cannot clear the QrCode elements', error);
      }
    },
  };

  // Render the children within the TaskContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useQrCodes hook.
  return (
    <QrCodesContext.Provider
      value={{
        createQrCode,
        updateQrCode,
        deleteAllQrCodes,
        clearAllFavoritesQrCodes,
        updateQrCodeToDelete,
        deleteAllMarkedQrCodes,
        clearAllMarkedToDeleteQrCodes,
        deleteQrCode,
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
    throw new Error('useQrCodes() called outside of a QrCodesProvider?'); // an alert is not placed because this is an error for the developer not the user
  }
  return resultSet;
};

export {QrCodesProvider, useQrCodes};
