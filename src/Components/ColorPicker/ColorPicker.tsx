import {Box, useTheme} from 'native-base';
import React from 'react';
import {ItemColorPicker} from './ItemColorPicker';

const excludedColors = [
  'contrastThreshold',
  'white',
  'black',
  'lightText',
  'darkText',
  'warmGray',
  'trueGray',
  'dark',
  'gray',
  'danger',
  'error',
  'success',
  'warning',
  'muted',
  'info',
  'light',
  'primary',
  'secondary',
  'tertiary',
];

interface IProps {
  onPress: (color: string) => void;
  shade: string;
  selectedColor?: string;
}

export const ColorPicker = (props: IProps) => {
  const {colors} = useTheme();

  const listThemeColors = Object.keys(colors).filter(
    (color: string) =>
      !excludedColors.find(excludedColor => color === excludedColor),
  );

  return (
    <Box flex={1} flexDirection={'row'} flexWrap={'wrap'} ml={8} mr={6}>
      {listThemeColors.map((color: string, index: number) => (
        <ItemColorPicker
          key={`${color}-${index}`}
          color={color}
          index={index}
          shade={props.shade}
          onPress={props.onPress}
          isSelected={false}
        />
      ))}
    </Box>
  );
};
