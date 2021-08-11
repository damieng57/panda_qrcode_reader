import React, {useContext, useState, useEffect, useRef} from 'react';
import Realm from 'realm';
import { realmSchemaConfiguration } from '../storage/realm';
import {QrCodeSchema} from '../storage/realm/models/models';
import { IQrCode } from '../types';

const QrCodesContext = React.createContext(null);

const QrCodesProvider = ({children}) => {
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
    console.log(newQrCode)
    realm.write(() => {
      // Create a new task in the same partition -- that is, in the same project.
      realm.create(
        'QrCode',
        newQrCode,
      );
    });
  };

  // Render the children within the TaskContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useTasks hook.
  return (
    <QrCodesContext.Provider
      value={{
        createQrCode,
        // deleteTask,
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
      throw new Error("useQrCodes() called outside of a QrCodesProvider?"); // an alert is not placed because this is an error for the developer not the user
    }
    return qrCodes;
  };
  
  export { QrCodesProvider, useQrCodes };