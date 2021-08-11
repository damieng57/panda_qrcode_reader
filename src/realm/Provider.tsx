import React, {useContext, useState, useEffect, useRef} from 'react';
import Realm from 'realm';
import {IQrCode} from '../types';
import {DecorationSchema, QrCodeSchema} from './models';

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
  schemaVersion: 8,
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
      realmRef.current = realm;

      const qrCodes = realm.objects('QrCode');
      // let sortedQrCodes = syncQrCodes.sorted("name");
      setQrCodes([...qrCodes]);
      qrCodes.addListener(() => {
        setQrCodes([...qrCodes]);
      });
    });

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
    const realm = realmRef.current;

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

  const deleteAllQrCode = () => {
    const realm = realmRef.current;

    try {
      if (realm === null) return;
      realm.write(() => {
        // Create a new task in the same partition -- that is, in the same project.
        realm.deleteAll('QrCode');
      });
    } catch (error) {
      return message('error', 'Cannot clear the QrCode elements', error);
    }
  };

  const deleteQrCode = (qrcode: IQrCode) => {
    const realm = realmRef.current;

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

  // Render the children within the TaskContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useTasks hook.
  return (
    <QrCodesContext.Provider
      value={{
        createQrCode,
        deleteAllQrCode,
        deleteQrCode,
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
