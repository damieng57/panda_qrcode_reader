import * as React from 'react';
import {View, StyleSheet, Vibration, Dimensions} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Snackbar, Text} from 'react-native-paper';
import {QrCode} from '../Objects/QrCode';
import {BarcodeMask} from '@nartc/react-native-barcode-mask';
import {getTranslation} from '../utils/helpers';
import {useTheme} from '../theme';
import {useAtom} from 'jotai';
import { atomWithStorage } from '../hooks/useAsyncStorage'


interface IState {
  isActive: boolean;
  isVisible: boolean;
}

const defaultState = {
  isActive: true,
  isVisible: false,
};

const historyAtom = atomWithStorage('DG:HISTORY', [])

export const ScanScreen = (props: any) => {
  const theme = useTheme();
  const [state, setState] = React.useState<IState>(defaultState);
  const [history, setHistory] = useAtom(historyAtom);

  const _isScanned = (item: any) => {
    Vibration.vibrate(500);
    const _temp = new QrCode({
      _id: item.rawData,
      favorite: false,
      data: item.data,
    });

    history !== undefined && setHistory([_temp.get()].concat(history));
    setState({
      isActive: false,
      isVisible: true,
    });
  };

  return (
    <>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <RNCamera
          // detectedImageInEvent
          captureAudio={false}
          style={styles.preview}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          onBarCodeRead={state.isActive ? data => _isScanned(data) : () => {}}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          {({status}) => {
            if (status !== 'READY') return null; // <PendingView />;
            return (
              <View
                style={{
                  flex: 1,
                  width: Dimensions.get('window').width,
                }}></View>
            );
          }}
        </RNCamera>

        <BarcodeMask
          showAnimatedLine={false}
          edgeRadius={15}
          maskOpacity={0.2}
        />

        <Snackbar
          theme={theme}
          style={{ marginBottom: 100, backgroundColor: theme.colors.surface }}
          visible={state.isVisible}
          onDismiss={() => {}}
          action={{
            label: 'Close',
            onPress: () => {
              setState({
                isActive: true,
                isVisible: false,
              });
            },
          }}>
          <Text style={{color: theme.colors.onSurface}}>
            {history.length > 0 && history[0].data}
          </Text>
        </Snackbar>
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
  contentContainer: {
    // paddingHorizontal: 24,
  },
  previewContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    backgroundColor: 'green',
    borderRadius: 20,
    // marginTop: 16,
    // overflow: 'hidden',
  },
});
