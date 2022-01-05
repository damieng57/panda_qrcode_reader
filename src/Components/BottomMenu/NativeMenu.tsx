import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {HStack, Center, Icon, Pressable, Text} from 'native-base';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getTranslation as t} from '../../utils/helpers';

export const NativeMenu = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const [selected, setSelected] = React.useState(1);

  React.useEffect(() => {
    navigation.navigate(state.routes[selected].name);
  }, [selected]);

  return (
    <HStack bg="indigo.600" alignItems="center" safeAreaBottom shadow={6}>
      <Pressable
        opacity={selected === 0 ? 1 : 0.5}
        py="3"
        flex={1}
        onPress={() => setSelected(0)}>
        <Center>
          <Icon
            mb="1"
            as={
              <MaterialCommunityIcons
                name='qrcode'
              />
            }
            color="white"
            size="sm"
          />
          <Text color="white" fontSize="12">
            {t('bottom_menu_scanner')}
          </Text>
        </Center>
      </Pressable>
      <Pressable
        opacity={selected === 1 ? 1 : 0.5}
        py="2"
        flex={1}
        onPress={() => setSelected(1)}>
        <Center>
          <Icon
            mb="1"
            as={<MaterialCommunityIcons name="history" />}
            color="white"
            size="sm"
          />
          <Text color="white" fontSize="12">
            {t('bottom_menu_history')}
          </Text>
        </Center>
      </Pressable>
      <Pressable
        opacity={selected === 2 ? 1 : 0.6}
        py="2"
        flex={1}
        onPress={() => setSelected(2)}>
        <Center>
          <Icon
            mb="1"
            as={
              <MaterialCommunityIcons
                name='cog'
              />
            }
            color="white"
            size="sm"
          />
          <Text color="white" fontSize="12">
            {t('bottom_menu_settings')}
          </Text>
        </Center>
      </Pressable>
      <Pressable
        opacity={selected === 3 ? 1 : 0.5}
        py="2"
        flex={1}
        onPress={() => setSelected(3)}>
        <Center>
          <Icon
            mb="1"
            as={
              <MaterialCommunityIcons
                name='information'
              />
            }
            color="white"
            size="sm"
          />
          <Text color="white" fontSize="12">
            {t('bottom_menu_about')}
          </Text>
        </Center>
      </Pressable>
    </HStack>
  );
};
