import * as React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  ViewStyle,
  Alert,
} from 'react-native';
import {
  Appbar,
  Switch,
  TextInput,
  Text,
  Subheading,
  Title,
  Divider,
  TouchableRipple,
} from 'react-native-paper';
import {getTranslation as t, historyAtom, settingsAtom} from '../utils/helpers';
import {palette} from '../theme/colors';
import {useTheme} from '../theme';
import {useAtom} from 'jotai';

export interface ITouchableColor {
  size?: number;
  color?: string;
  style?: ViewStyle;
  onPress: () => void;
}

// TODO: Component to change accent color
export const TouchableColor = (props: ITouchableColor) => {
  const {size, style, onPress} = props;
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: props.color || theme.colors.accent,
          borderRadius: (size && size / 2) || 15,
          height: size || 30,
          width: size || 30,
        },
        style,
      ]}></TouchableOpacity>
  );
};

export const SettingsScreen = (props: any) => {
  const theme = useTheme();
  const [settings, setSettings] = useAtom(settingsAtom);
  const [_, setHistory] = useAtom(historyAtom);
  const [isAnonym, setAnonym] = React.useState(false);
  const [isDarkMode, setTheme] = React.useState(true);
  const [maxItems, setMaxItems] = React.useState(100);

  React.useEffect(() => {
    setSettings({
      ...settings,
      isAnonym,
      isDarkMode: isDarkMode ? 'dark' : 'light',
      maxItems,
    });
  }, [isAnonym, isDarkMode, maxItems]);

  const _clear = (element: string) => {
    setHistory([]);
  };

  const _showAlert = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: t('alert_cancel'),
        onPress: () => {},
      },
      {
        text: t('alert_ok'),
        onPress: () => _clear('FAVORITES'),
      },
    ]);
  };

  const _clearFavorites = () => {
    _showAlert(
      t('alert_delete_favorites'),
      t('alert_delete_favorites_message'),
    );
  };

  const _clearHistory = () => {
    _showAlert(t('alert_delete_list'), t('alert_delete_list_message'));
  };

  return (
    <>
      <Appbar.Header style={{backgroundColor: theme.colors.surface}}>
        <Appbar.Content title={t('header_title_settings')}></Appbar.Content>
      </Appbar.Header>
      <ScrollView
        style={{marginBottom: 50, backgroundColor: theme.colors.surface}}
        contentContainerStyle={{paddingVertical: 16}}>
        <Title style={[styles.title, {color: theme.colors.onSurface}]}>
          {t('history_settings_title')}
        </Title>

        <TouchableRipple
          style={styles.items}
          onPress={() => setAnonym(!isAnonym)}>
          <>
            <View style={styles.texts}>
              <Subheading style={{color: theme.colors.onSurface}}>
                {t('settings_anonym_mode')}
              </Subheading>
              <Text style={{color: theme.colors.onSurface, opacity: 0.8}}>
                {t('settings_anonym_mode_description')}
              </Text>
            </View>
            <Switch
              value={isAnonym}
              onValueChange={() => setAnonym(!isAnonym)}
              color={settings?.accentColor}
            />
          </>
        </TouchableRipple>

        <View style={styles.items}>
          <TouchableRipple style={styles.texts} onPress={() => _clearHistory()}>
            <>
              <Subheading style={{color: theme.colors.onSurface}}>
                {t('settings_clear_history')}
              </Subheading>
              <Text style={{color: theme.colors.onSurface, opacity: 0.8}}>
                {t('settings_clear_history_description')}
              </Text>
            </>
          </TouchableRipple>
        </View>

        <View style={styles.items}>
          <TouchableRipple
            style={styles.texts}
            onPress={() => _clearFavorites()}>
            <>
              <Subheading style={{color: theme.colors.onSurface}}>
                {t('settings_clear_favorites')}
              </Subheading>
              <Text style={{color: theme.colors.onSurface, opacity: 0.8}}>
                {t('settings_clear_favorites_description')}
              </Text>
            </>
          </TouchableRipple>
        </View>

        <View style={styles.items}>
          <View style={styles.texts}>
            <Subheading style={{color: theme.colors.onSurface}}>
              {t('settings_history_size')}
            </Subheading>
            <Text style={{color: theme.colors.onSurface, opacity: 0.8}}>
              {t('settings_history_size_description')}
            </Text>
          </View>
          <TextInput
            keyboardType="numeric"
            placeholder={settings?.maxItems.toString()}
            onChangeText={(value: string) => setMaxItems(parseInt(value, 10))}
            style={{
              minWidth: 36,
              height: 36,
              marginRight: 16,
            }}
          />
        </View>
        {__DEV__ && (
          <>
            <Divider style={{backgroundColor: 'gray', height: 1}}></Divider>
            <Title style={[styles.title, {color: theme.colors.onSurface}]}>
              {t('settings_theme_title')}
            </Title>
            <TouchableRipple
              style={styles.items}
              onPress={() => setTheme(!isDarkMode)}>
              <>
                <View style={styles.texts}>
                  <Subheading style={{color: theme.colors.onSurface}}>
                    {t('settings_dark_mode')}
                  </Subheading>
                  <Text style={{color: theme.colors.onSurface, opacity: 0.8}}>
                    {t('settings_dark_mode_description')}
                  </Text>
                </View>
                <Switch
                  value={isDarkMode}
                  onValueChange={() => setTheme(!isDarkMode)}
                  color={settings?.accentColor}
                />
              </>
            </TouchableRipple>
            <View style={[styles.items, {flexDirection: 'column'}]}>
              <View style={styles.texts}>
                <Subheading style={{color: theme.colors.onSurface}}>
                  {t('settings_accent_color')}
                </Subheading>
                <Text style={{color: theme.colors.onSurface, opacity: 0.8}}>
                  {t('settings_accent_color_description')}
                </Text>
                <ScrollView
                  horizontal
                  style={{marginTop: 16}}
                  showsHorizontalScrollIndicator={false}>
                  {palette.map(
                    (color: string, index: number): JSX.Element => (
                      <TouchableColor
                        key={index}
                        onPress={() => console.log('change color')}
                        color={color}
                        size={30}
                        style={{marginHorizontal: 5}}></TouchableColor>
                    ),
                  )}
                </ScrollView>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  items: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  title: {fontSize: 12, paddingHorizontal: 16},
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  texts: {flex: 1, padding: 16, paddingLeft: 72, paddingRight: 16},
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },

  standalone: {
    marginTop: 30,
    marginBottom: 30,
  },
  standaloneRowFront: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  standaloneRowBack: {
    alignItems: 'center',
    // backgroundColor: '#8BC',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backTextWhite: {
    color: '#FFF',
  },
});
