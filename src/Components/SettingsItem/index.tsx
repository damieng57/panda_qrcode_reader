import {TouchableNativeFeedback} from 'react-native';
import {Text, Switch, Heading, HStack, VStack} from 'native-base';
import React from 'react';
import { colors } from '../../utils/colors';
import { useAtom } from 'jotai';
import { defaultConfig, settingsAtom } from '../../utils/helpers';

export interface IProps {
  onPress: () => void;
  title: string;
  description: string;
  isChecked?: boolean;
  hasSwitch?: boolean;
  switchColor?: string;
}

export const SettingsItem = (props: IProps) => {
  const [settings] = useAtom(settingsAtom);
  const {onPress, title, description, hasSwitch, isChecked, switchColor} =
    props;

  const baseColor =
    settings?.accentColor?.split('.')[0] ||
    defaultConfig.accentColor.split('.')[0];

  return (
    <TouchableNativeFeedback
      onPress={onPress}
      useForeground
      background={TouchableNativeFeedback.Ripple(colors[baseColor]['100'], false)}>
      <HStack
        flex="1"
        paddingLeft={12}
        paddingRight={6}
        height={24}
        alignItems={'center'}>
        <VStack flex={1}>
          <Heading size={'xs'}>
            {title}
          </Heading>
          <Text >{description}</Text>
        </VStack>
        {hasSwitch && (
          <Switch
            isChecked={isChecked}
            onToggle={onPress}
            color={switchColor}
          />
        )}
      </HStack>
    </TouchableNativeFeedback>
  );
};
