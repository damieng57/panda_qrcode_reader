import * as React from 'react';
import {Vibration, Linking} from 'react-native';
import {Barcode, RNCamera} from 'react-native-camera';
import {BarcodeMask} from '@nartc/react-native-barcode-mask';
import {
  getTranslation as t,
  settingsAtom,
  formatQrCode,
} from '../utils/helpers';
import {useAtom} from 'jotai';
import {useQrCodes} from '../realm/Provider';
import {IQrCode} from '../types';
import {
  VStack,
  HStack,
  Alert,
  Text,
  Box,
  useToast,
  useColorModeValue,
  Icon,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
  const toast = useToast();
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
      if (!url) {
        return null;
      }
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
    } finally {
      _init();
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
        settings.openUrlAuto
          ? _openURL()
          : toast.show({
              description: _formatTextSnackBar(item?.data || '')
                .slice(0, 47)
                .concat('...'),
              isClosable: true,
              onCloseComplete: _init,
            });
      }
    },
    [state],
  );

  return (
    <Box flex="1" bg={useColorModeValue('warmGray.50', 'coolGray.800')}>
      {/* Infobar - anonymous mode */}
      {settings?.isAnonym && (
        <Alert w="100%" status="warning" borderRadius={0}>
          <VStack space={1} flexShrink={1} w="100%">
            <HStack flexShrink={1} space={2} alignItems="center">
              <Icon
                mr="3"
                size="5"
                _dark={{
                  color: 'coolGray.800',
                }}
                as={<MaterialCommunityIcons name="alert-outline" />}
              />
              <HStack flexShrink={1} space={2} alignItems="center">
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  _dark={{
                    color: 'coolGray.800',
                  }}>
                  {t('mode_anonyme_banner_message')}
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Alert>
      )}
      {/* End of infobar - anonymous mode */}
      <Box flex={1}>
        <RNCamera
          // detectedImageInEvent
          captureAudio={false}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
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
              <BarcodeMask
                showAnimatedLine={false}
                edgeRadius={15}
                maskOpacity={0.2}
              />
            );
          }}
        </RNCamera>
      </Box>
    </Box>
  );
};
