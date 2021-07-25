import * as React from 'react';
import {
  View,
  StyleSheet,
  Vibration,
  Dimensions,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Text} from 'react-native-paper';
import {QrCode} from '../Objects/QrCode';
import {BarcodeMask} from '@nartc/react-native-barcode-mask';
import {getTranslation as t, historyAtom, settingsAtom} from '../utils/helpers';
import {useTheme} from '../theme';
import {useAtom} from 'jotai';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {PendingView} from '../Components/PendingView';
import {ISettings} from '../types';

interface IState {
  isActive: boolean;
  isVisible: boolean;
}

const defaultState = {
  isActive: true,
  isVisible: false,
};

export const ScanScreen = (props: any) => {
  const theme = useTheme();
  const [history, setHistory] = useAtom(historyAtom);
  const [settings] = useAtom<ISettings>(settingsAtom);
  const [state, setState] = React.useState<IState>(defaultState);

  const _init = () => {
    setState({
      isVisible: false,
      isActive: true,
    });
  };

  const _openURL = React.useCallback(async () => {
    const url = history.length > 0 && history[0].data;

    try {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        props.navigation.navigate('details', history[0].data);
      }
    } catch (error) {
      console.warn(error);
    }
  }, [history]);

  const _isScanned = (item: any) => {
    Vibration.vibrate(500);
    const _temp = new QrCode({
      _id: item.rawData,
      favorite: false,
      date: Date.now(),
      data: item.data,
    });

    settings.isAnonym && setHistory([_temp.get()].concat(history));
    setState({
      isActive: false,
      isVisible: true,
    });
  };

  return (
    <>
      {settings.isAnonym && (
        <View
          style={[
            styles.bannerAnonym,
            {backgroundColor: theme.colors.warning},
          ]}>
          <MaterialCommunityIcons
            name="alert-outline"
            size={24}
            style={[
              styles.iconBannerAnonym,
              {color: theme.colors.background},
            ]}></MaterialCommunityIcons>
          <Text style={{color: theme.colors.background}}>
            {t('mode_anonyme_banner_message')}
          </Text>
        </View>
      )}
      <View style={styles.container}>
        <RNCamera
          // detectedImageInEvent
          captureAudio={false}
          style={styles.preview}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          onBarCodeRead={state.isActive ? data => _isScanned(data) : () => {}}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: t('permission_camera'),
            message: t('permission_camera_message'),
            buttonPositive: t('alert_ok'),
            buttonNegative: t('alert_cancel'),
          }}>
          {({status}) => {
            if (status !== RNCamera.Constants.CameraStatus.READY) {
              return <PendingView />;
            }
            return (
              <View
                style={{
                  flex: 1,
                  width: Dimensions.get('window').width,
                }}>
                <BarcodeMask
                  showAnimatedLine={false}
                  edgeRadius={15}
                  maskOpacity={0.2}
                />
              </View>
            );
          }}
        </RNCamera>
      </View>
      {state.isVisible && (
        <View
          style={[
            styles.snackbarContainer,
            {backgroundColor: theme.colors.surface},
          ]}>
          <TouchableOpacity onPress={() => _openURL()}>
            <Text
              style={[
                styles.snackbarText,
                {
                  color: theme.colors.onSurface,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {history.length > 0 && history[0].data}
            </Text>
          </TouchableOpacity>
          <MaterialCommunityIcons
            color={theme.colors.onSurface}
            name="close"
            size={24}
            onPress={() => _init()}></MaterialCommunityIcons>
        </View>
      )}
    </>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snackbarText: {
    textAlignVertical: 'center',
  },
  snackbarContainer: {
    height: 50,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 64,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconBannerAnonym: {
    width: 24,
    marginRight: 8,
  },
  bannerAnonym: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
