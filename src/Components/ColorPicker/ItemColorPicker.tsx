import {Center, IconButton, Icon} from 'native-base';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IProps {
  color: string;
  index: number;
  shade: string;
  onPress: (color: string) => void;
  isSelected: boolean;
}

export const ItemColorPicker = ({
  color,
  index,
  shade,
  onPress,
  isSelected,
}: IProps) => {
  return (
    <Center
      width={'20%'}
      mb={2}
      flexDirection={'row'}>
      <IconButton
        height={12}
        width={12}
        bg={`${color}.${shade}`}
        borderRadius="999px"
        icon={
          isSelected ? (
            <Icon
              alignSelf={'center'}
              pt={1}
              as={<MaterialCommunityIcons name={'check'} />}
              size="sm"
            />
          ) : (
            <React.Fragment></React.Fragment>
          )
        }
        onPress={() => onPress(`${color}.${shade}`)}
      />
    </Center>
  );
};
