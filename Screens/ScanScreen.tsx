import * as React from 'react';
import {Text, View, StyleSheet, Vibration, Dimensions} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {AppContext} from '../App';
import {Appbar, Snackbar} from 'react-native-paper';
import {QrCode} from '../Objects/QrCode';
import {BarcodeMask} from '@nartc/react-native-barcode-mask';
import {getTranslation} from '../Utils/helpers';

const PendingView = () => (
  <View
    style={{
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    }}>
    <Text>{getTranslation('waiting')}</Text>
  </View>
);

export const ScanScreen = props => {
  const globalState = React.useContext(AppContext);
  const [isActive, setIsActive] = React.useState(true);
  const [isVisible, setIsVisible] = React.useState(false);

  const _isScanned = (item: any) => {
    Vibration.vibrate(500);
    setIsActive(false);
    const _temp = new QrCode({
      _id: item.rawData,
      favorite: false,
      data: item.data,
    });

    globalState.history === undefined
      ? globalState.setHistory([_temp.get()])
      : globalState.setHistory([_temp.get()].concat(globalState.history));
    setIsVisible(true);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={getTranslation('header_title')}></Appbar.Content>
        <Appbar.Action
          icon="information"
          onPress={() => props.navigation.navigate('About')}></Appbar.Action>
      </Appbar.Header>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <RNCamera
          // detectedImageInEvent
          captureAudio={false}
          style={styles.preview}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          onBarCodeRead={isActive ? data => _isScanned(data) : null}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          {({status}) => {
            if (status !== 'READY') return <PendingView />;
            return (
              <View
                style={{
                  flex: 1,
                  width: Dimensions.get('window').width,
                }}></View>
            );
          }}
        </RNCamera>
        <Snackbar
          visible={isVisible}
          duration={3000}
          onDismiss={() => {
            setIsVisible(false);
            setIsActive(true);
          }}>
          {globalState.history && globalState.history[0].data}
        </Snackbar>
        <BarcodeMask
          showAnimatedLine={false}
          edgeRadius={15}
          maskOpacity={0.2}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
