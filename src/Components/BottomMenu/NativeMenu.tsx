import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useAtom} from 'jotai';
import {HStack, Center, Icon, Pressable, Text, Box} from 'native-base';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getTranslation as t} from '../../utils/helpers';
import {defaultStore, storeAtom} from '../../utils/store';

const StyledIcon = (selected: boolean, name: string, text: string) => {
  return selected ? (
    <>
      <Box
        borderRadius={14}
        _dark={{
          bg: 'primary.700',
        }}
        _light={{
          bg: 'primary.200',
        }}
        alignItems={'center'}
        paddingTop={0.5}
        minWidth={16}
        minHeight={7}>
        <Icon mb="1" as={<MaterialCommunityIcons name={name} />} size="sm" />
      </Box>
      <Text bold fontSize="12">
        {text}
      </Text>
    </>
  ) : (
    <>
      <Box
        borderRadius={14}
        alignItems={'center'}
        paddingTop={0.5}
        minWidth={16}
        minHeight={7}>
        <Icon mb="1" as={<MaterialCommunityIcons name={name} />} size="sm" />
      </Box>
      <Text bold fontSize="12">
        {text}
      </Text>
    </>
  );
};

export const NativeMenu = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const [store] = useAtom(storeAtom);
  const [selected, setSelected] = React.useState(store?.currentScreen || 0);

  React.useEffect(() => {
    navigation.navigate(state.routes[selected].name);
  }, [selected]);

  return (
    <HStack
      style={{height: 56}}
      alignItems="center"
      bg={'primary.500' || defaultStore.accentColor}>
      <Pressable
        opacity={selected === 0 ? 1 : 0.5}
        py="3"
        flex={1}
        onPress={() => setSelected(0)}>
        <Center>
          {StyledIcon(selected === 0, 'qrcode', t('bottom_menu_scanner'))}
        </Center>
      </Pressable>
      <Pressable
        opacity={selected === 1 ? 1 : 0.5}
        py="2"
        flex={1}
        onPress={() => setSelected(1)}>
        <Center>
          {StyledIcon(selected === 1, 'history', t('bottom_menu_history'))}
        </Center>
      </Pressable>
      <Pressable
        opacity={selected === 2 ? 1 : 0.6}
        py="2"
        flex={1}
        onPress={() => setSelected(2)}>
        <Center>
          {StyledIcon(selected === 2, 'cog', t('bottom_menu_settings'))}
        </Center>
      </Pressable>
      <Pressable
        opacity={selected === 3 ? 1 : 0.5}
        py="2"
        flex={1}
        onPress={() => setSelected(3)}>
        <Center>
          {StyledIcon(
            selected === 3,
            selected === 3 ? 'information' : 'information-outline',
            t('bottom_menu_about'),
          )}
        </Center>
      </Pressable>
    </HStack>
  );
};
