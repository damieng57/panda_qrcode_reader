import {TouchableNativeFeedback} from 'react-native';
import {Text, Switch, Box, Heading, HStack, VStack} from 'native-base';
import React from 'react';

export interface IProps {
  onPress: () => void;
  title: string;
  description: string;
  isChecked?: boolean;
  hasSwitch?: boolean;
  switchColor?: string;
}

export const SettingsItem = (props: IProps) => {
  const {onPress, title, description, hasSwitch, isChecked, switchColor} =
    props;
  return (
    <TouchableNativeFeedback
      onPress={() => {}}
      useForeground
      background={TouchableNativeFeedback.Ripple('white', false)}>
      <HStack
        flex="1"
        paddingLeft={12}
        paddingRight={6}
        height={24}
        alignItems={'center'}>
        <VStack flex={1}>
          <Heading color="white" size={'xs'}>
            {title}
          </Heading>
          <Text color="white">{description}</Text>
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
