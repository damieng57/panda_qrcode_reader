import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useTheme } from '../theme';

export const PendingView = ():React.ReactElement => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.pendingView,
        {
          backgroundColor: theme.colors.surface,
        },
      ]}>
      <ActivityIndicator color={theme.colors.accent} />
    </View>
  );
};

export const styles = StyleSheet.create({
  pendingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
