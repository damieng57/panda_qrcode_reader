import * as React from 'react';
import {Vibration, Linking} from 'react-native';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import {BarcodeMask} from '@nartc/react-native-barcode-mask';
import {getTranslation as t, formatQrCode} from '../utils/helpers';
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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {debounce} from 'lodash';
import {isAnonymAtom, openUrlAutoAtom} from '../utils/atoms';

const MAX_LENGTH_SNACKBAR = 57;

interface IState {
  isActive: boolean;
  current?: IQrCode;
  error: boolean;
}

const defaultState = {
  isActive: true,
  current: undefined,
  error: false,
};

export const ScanScreen = () => {
  const [state, setState] = React.useState<IState>(defaultState);
  const {create} = useQrCodes();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const toast = useToast();
  const [openUrlAuto] = useAtom(openUrlAutoAtom);
  const [isAnonym] = useAtom(isAnonymAtom);

  const _init = () => {
    setState({
      isActive: isFocused,
      current: undefined,
      error: false,
    });
  };

  const timer = React.useCallback(debounce(_init, 4000, {trailing: true}), []);

  React.useEffect(() => {
    if (!state.isActive && state.current) {
      !isAnonym && create(state.current);
    }
  }, [state.current, state.isActive]);

  const _openURL = async (item: BarCodeReadEvent) => {
    try {
      const url = item?.data;
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
        navigation.navigate('details', state.current);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      timer();
    }
  };

  const _formatTextSnackBar = (text: string): string => {
    // TODO: Improve using Dimensions of the screen
    if (!text) {
      return '';
    }
    if (text.length > MAX_LENGTH_SNACKBAR) {
      return text.slice(0, MAX_LENGTH_SNACKBAR - 3) + '...';
    }
    return text;
  };

  const handleScan = (item: BarCodeReadEvent) => {
    if (!state.isActive || !isFocused || state.error) {
      return undefined;
    }
    Vibration.vibrate(500);

    const formattedQrCode = formatQrCode(item, false);

    if (formattedQrCode.decoration === undefined) {
      return setState({
        isActive: false,
        error: true,
      });
    }

    setState({
      isActive: false,
      current: formatQrCode(item, false),
      error: false,
    });

    openUrlAuto
      ? _openURL(item)
      : toast.show({
          description: _formatTextSnackBar(item?.data || ''),
          isClosable: true,
          onCloseComplete: timer,
          style: {marginHorizontal: 8},
        });
  };

  return (
    <Box flex="1" bg={useColorModeValue('warmGray.50', 'coolGray.800')}>
      {/* Infobar - anonymous mode */}
      {isAnonym && (
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
          onBarCodeRead={item => handleScan(item)}
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
