import * as React from 'react';
import {HStack, Text} from 'native-base';

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
