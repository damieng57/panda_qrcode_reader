import * as React from 'react';
import {
  View,
  StyleSheet,
  Vibration,
  Dimensions,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {Barcode, RNCamera} from 'react-native-camera';
import {BarcodeMask} from '@nartc/react-native-barcode-mask';
import {
  getTranslation as t,
  settingsAtom,
  formatQrCode,
} from '../utils/helpers';
import {useTheme} from '../theme';
import {useAtom} from 'jotai';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useQrCodes} from '../realm/Provider';
import {IQrCode} from '../types';
import {Snackbar, Text} from 'react-native-paper';

const MAX_LENGHT_SNACKBAR = 60;

interface IState {
  isActive: boolean;
  isVisible: boolean;
  barcode?: Barcode;
  current?: IQrCode;
}

const defaultState = {
  isActive: true,
  isVisible: false,
  barcode: undefined,
  current: undefined,
};

export const ScanScreen = (props: any & IState) => {
  const [state, setState] = React.useState<IState>(defaultState);
  const [settings] = useAtom(settingsAtom);
  const theme = useTheme();
  const {createQrCode} = useQrCodes();

  const _init = () => {
    setState({
      isVisible: false,
      isActive: true,
      barcode: undefined,
      current: undefined,
    });
  };

  React.useEffect(() => {
    if (!state.isActive && state.barcode) {
      createQrCode(state.current);
    }
  }, [state.barcode, state.isActive]);

  const _openURL = React.useCallback(async () => {
    try {
      const url = state.barcode?.data;
      if (!url) return;
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        props.navigation.navigate('details', state.current);
      }
    } catch (error) {
      console.warn(error);
    }
  }, [state]);

  const _formatTextSnackBar = (text: string): string => {
    if (!text) return '';
    if (text.length > MAX_LENGHT_SNACKBAR) {
      return text.slice(0, MAX_LENGHT_SNACKBAR - 3) + '...';
    }
    return text;
  };

  const _isScanned = React.useCallback(
    (item: any) => {
      if (!settings?.isAnonym && state.isActive) {
        Vibration.vibrate(500);
        setState({
          isActive: false,
          isVisible: true,
          barcode: item,
          current: formatQrCode(item, false),
        });
      }
    },
    [state],
  );

  return (
    <>
      {settings?.isAnonym && (
        <View
          style={[
            styles.bannerAnonym,
            {backgroundColor: theme.colors.warning},
          ]}>
          <MaterialCommunityIcons
            name="alert-outline"
            size={24}
            style={[styles.iconBannerAnonym]}></MaterialCommunityIcons>
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
          onBarCodeRead={data => _isScanned(data)}
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
              return null;
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
      <Snackbar
        visible={state.isVisible}
        onDismiss={() => _init()}
        style={{marginBottom: 80, borderRadius: 5}}
        action={{
          label: (
            <MaterialCommunityIcons
              color={theme.colors.accent}
              name="close"
              size={24}
              onPress={() => _init()}></MaterialCommunityIcons>
          ),
          onPress: () => _openURL(),
        }}>
        {_formatTextSnackBar(state.barcode?.data)}
      </Snackbar>
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
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    width: '100%'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
