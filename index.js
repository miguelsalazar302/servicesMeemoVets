/**
 * @format
 */
if(__DEV__) {
    import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

console.disableYellowBox = true;

navigator.geolocation = require('@react-native-community/geolocation');

AppRegistry.registerComponent(appName, () => App);