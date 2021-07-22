import * as React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  ViewStyle,
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
import {getTranslation as t} from '../utils/helpers';

import {useTheme} from '../theme';
import {
  red300,
  redA200,
  pink300,
  pinkA200,
  purple300,
  purpleA200,
  deepPurple300,
  indigo300,
  blue300,
  lightBlue300,
  lightBlueA200,
  cyan300,
  cyanA200,
  teal300,
  tealA200,
  green300,
  greenA400,
  lightGreen300,
  lightGreenA200,
  lime300,
  limeA200,
  yellow300,
  yellowA200,
  amber300,
  amberA200,
  orange300,
  orangeA200,
  deepOrange300,
  deepOrangeA200,
  brown300,
  blueGrey300,
  grey300,
} from '../theme/colors';

export interface ITouchableColor {
  size?: number;
  color?: string;
  style?: ViewStyle;
  onPress: () => void;
}

const colors = [
  red300,
  redA200,
  pink300,
  pinkA200,
  purple300,
  purpleA200,
  deepPurple300,
  indigo300,
  blue300,
  lightBlue300,
  lightBlueA200,
  cyan300,
  cyanA200,
  teal300,
  tealA200,
  green300,
  greenA400,
  lightGreen300,
  lightGreenA200,
  lime300,
  limeA200,
  yellow300,
  yellowA200,
  amber300,
  amberA200,
  orange300,
  orangeA200,
  deepOrange300,
  deepOrangeA200,
  brown300,
  blueGrey300,
  grey300,
];

export const TouchableColor = (props: ITouchableColor) => {
  const {size, style, onPress} = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: props.color || 'red',
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
  const [isAnonym, setAnonym] = React.useState(false);
  const [isExpand, setExpand] = React.useState(false);

  const _clearHistory = () => {
    console.log('Clear history');
  };

  const _clearFavorites = () => {
    console.log('Clear favorites');
  };

  const _openPalette = () => {
    console.log('Ouvrir la palette');
    setExpand(!isExpand);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content
          title={t('header_title_settings')}></Appbar.Content>
      </Appbar.Header>
      <ScrollView
        style={{marginBottom: 50}}
        contentContainerStyle={{paddingVertical: 16}}>
        <Title style={styles.title}>HISTORIQUE</Title>

        <View style={styles.items}>
          <View style={styles.texts}>
            <Subheading style={{color: 'white'}}>
              Activer le mode anonyme
            </Subheading>
            <Text style={{color: 'lightgray'}}>
              Les scans ne seront pas enregistrés dans l'historique
            </Text>
          </View>
          <Switch value={isAnonym} onValueChange={() => setAnonym(!isAnonym)} />
        </View>

        <View style={styles.items}>
          <TouchableRipple style={styles.texts} onPress={() => _clearHistory()}>
            <>
              <Subheading style={{color: 'white'}}>
                Effacer l'historique
              </Subheading>
              <Text style={{color: 'lightgray'}}>
                Pour effacer l'intégralité de l'historique
              </Text>
            </>
          </TouchableRipple>
        </View>

        <View style={styles.items}>
          <TouchableRipple
            style={styles.texts}
            onPress={() => _clearFavorites()}>
            <>
              <Subheading style={{color: 'white'}}>
                Effacer les favoris
              </Subheading>
              <Text style={{color: 'lightgray'}}>
                Pour effacer tous vos favoris
              </Text>
            </>
          </TouchableRipple>
        </View>

        <View style={styles.items}>
          <View style={styles.texts}>
            <Subheading style={{color: 'white'}}>
              Taille de l'historique
            </Subheading>
            <Text style={{color: 'lightgray'}}>
              Définir la taille de l'historique (100 éléments max.)
            </Text>
          </View>
          <TextInput
            style={{
              minWidth: 36,
              height: 36,
              backgroundColor: 'white',
              marginRight: 16,
            }}
          />
        </View>

        <Divider style={{backgroundColor: 'gray', height: 1}}></Divider>

        <Title style={styles.title}>THEME</Title>

        <View style={styles.items}>
          <View style={styles.texts}>
            <Subheading style={{color: 'white'}}>Mode sombre</Subheading>
            <Text style={{color: 'lightgray'}}>
              Choisir d'activer ou de désactiver le mode sombre
            </Text>
          </View>
          <Switch value={isAnonym} onValueChange={() => setAnonym(!isAnonym)} />
        </View>

        <View style={[styles.items, {flexDirection: 'column'}]}>
          <View style={styles.texts}>
            <Subheading style={{color: 'white'}}>
              Couleur d'accentuation
            </Subheading>
            <Text style={{color: 'lightgray'}}>
              Choisir une couleur d'accentuation
            </Text>
            <ScrollView
              horizontal
              style={{marginTop: 16}}
              showsHorizontalScrollIndicator={false}>
              {colors.map(
                (color: string, index: number): JSX.Element => (
                  <TouchableColor
                    key={index}
                    onPress={() => {}}
                    color={color}
                    size={30}
                    style={{marginHorizontal: 5}}></TouchableColor>
                ),
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  items: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  title: {fontSize: 12, color: 'lightgray', paddingHorizontal: 16},
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  texts: {flex: 1, paddingLeft: 56, paddingRight: 16},
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
