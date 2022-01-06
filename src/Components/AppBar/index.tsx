import * as React from 'react';
import {HStack, Icon, IconButton, Text} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IProps {
  title: string;
}

export const AppBar = (props: IProps) => {
  return (
    <HStack
      px="3"
      py="3"
      justifyContent="space-between"
      alignItems="center">
      <HStack space="4" alignItems="center">
        <Text fontSize="20" fontWeight="bold">
          {props.title}
        </Text>
      </HStack>
    </HStack>
  );
};
