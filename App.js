import React, {Component} from 'react';
import type {Node} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar, Modal, TouchableOpacity, useColorScheme
} from 'react-native';

// REACT-NAVIGATION
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

//Necesarios
import OneSignal from 'react-native-onesignal'; // Import package from node modules
import NavigationService from './NavigationService';
import AuthService from "./modules/AuthService";
import locales from "./locales/es";
import Helpers from "./modules/Helpers";

// Screens
import AuthLoading from './screens/AuthLoading';
import WalkthroughScreen from './screens/WalkthroughScreen';
import WalkthroughScreenVet from "./screens/WalkthroughScreenVet";

// Screens Auth
import Login from './screens/Login';
import Recovery from './screens/Recovery';
import RegisterSelect from "./screens/RegisterSelect";
import RegisterVet from './screens/RegisterVet';
import RegisterService from "./screens/RegisterService";

// Screens Main
import Home from './screens/Home';
import MyProfile from './screens/MyProfile';
import MyProfileVet from './screens/MyProfileVet';
import ChangePassword from './screens/ChangePassword';
import Configuration from './screens/Configuration';
import AgendaVet from './screens/AgendaVet';
//import MapZoneVet from "./screens/MapZoneVet";
//import Map from "./screens/Map/Map";
import PriceVet from "./screens/PriceVet/PriceVet";
import Services from "./screens/Services/index";
import Address from "./screens/Address/index";
import ProfileVet from "./screens/ProfileVet/index";
import ProfilePetOwner from "./screens/ProfilePetOwner";
//import BookVetService from "./screens/BookVetService/index"; //<-- no existe este archivo
import MyAppointments from "./screens/MyAppointments/MyAppointments";
import AppointmentClose from "./screens/AppointmentClose/AppointmentClose";
import ProfileAppointmentClose from "./screens/ProfileAppointmentClose/ProfileAppointmentClose";
import MyPetOwners from "./screens/MyPetOwners/MyPetOwners";
import EditProfileVet from "./screens/EditProfileVet";
import ProfileBooking from "./screens/ProfileBooking/ProfileBooking";
import ProfilePet from "./screens/ProfilePet";
import Wallet from "./screens/Wallet/Wallet";
import Chat from "./screens/Chat/Chat";
import FreeChat from "./screens/FreeChat/FreeChat";
import Chatlist from "./screens/Chatlist/index";
import ProfileService from "./screens/ProfileService/index";


const AppStack = createStackNavigator({
    Home: {screen: Home},
    MyProfile: {screen: MyProfile},
    MyProfileVet: {screen: MyProfileVet},
    ChangePassword: {screen: ChangePassword},
    Configuration: {screen: Configuration},
    AgendaVet: {screen: AgendaVet},
    // MapZoneVet: {screen: MapZoneVet}, // <-- Error en el mapa, al usar la libreria
    // Map: {screen: Map}, 
    PriceVet: {screen: PriceVet},
    Services: {screen: Services},
    Address: {screen: Address},
    ProfileVet: {screen: ProfileVet},
    ProfilePetOwner: {screen: ProfilePetOwner},
    // BookVetService: { screen: BookVetService },
    MyAppointments: {screen: MyAppointments},
    AppointmentClose: {screen: AppointmentClose},
    ProfileAppointmentClose: {screen: ProfileAppointmentClose},
    MyPetOwners: {screen: MyPetOwners},
    EditProfileVet: {screen: EditProfileVet},
    ProfileBooking: {screen: ProfileBooking},
    ProfilePet: {screen: ProfilePet},
    Wallet: {screen: Wallet},
    Chat: {screen: Chat},
    FreeChat: {screen: FreeChat},
    Chatlist: {screen: Chatlist},
    ProfileService: {screen: ProfileService}
  },
  {
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#0e1130',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
    navigationOptions: {
      gesturesEnabled: false,
    },
});



const AuthStack = createStackNavigator({
    /*SignIn: Splash,
    Terms: Terms,
    */
    Login,
    Recovery,
    RegisterVet,
    RegisterService,
    RegisterSelect
  },
  {
    navigationOptions: {
      gesturesEnabled: false,
    },
  }
);

const RootStack = createStackNavigator(
  { 
    //TEST
    //ProfileService: ProfileService, 
    AuthLoading: AuthLoading,
    Walkthrough: {
      screen: WalkthroughScreen,
    },
    WalkthroughVet: {
      screen: WalkthroughScreenVet,
    },
    Auth: {
      screen: AuthStack,
    },
    Main: {
      screen: AppStack,
    }
  },
  {
    initialRouteName: 'AuthLoading',
    mode: 'modal',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false,
    },
  }
);

const AppContainer = createAppContainer(RootStack);

type Props = {};

const minVersionAndroid = 1;
const minVersionIos = 1;

export default class App extends Component<Props> {

  constructor(properties) {
    super(properties);
    this.state = {
      updateModal: false
    };
    this.auth = new AuthService();
    this.helpers = new Helpers(); 
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
    // alert("Notification received: ", notification);
  }

  goToPetProfile(petId) {
    NavigationService.navigate('ProfilePet', {petId})
  }

  onOpened(openResult) {
    // alert('Message: ', openResult.notification.payload.body);
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);

    const pushData = openResult.notification.payload.additionalData;
    if (pushData.type && pushData.type === 'chat') {
      setTimeout(() => NavigationService.navigate('Chat', {bookingId: pushData.booking_id}), 3000); // TODO IMPROVE
    }

    if (pushData.type && pushData.type === 'free_chat') {
      setTimeout(() => NavigationService.navigate('FreeChat', {chatId: pushData.booking_id}), 3000); // TODO IMPROVE
    }

    if (pushData.type && pushData.type === 'Control') {
      setTimeout(() => this.goToPetProfile(pushData.aux), 3000); // TODO IMPROVE
    }
  }

  onIds(device) {
    // alert('Device info: ', device);
    console.log('Device info: ', device);
  }

  componentDidMount() {
    this.auth.saveConfigData().then(res => {
      if (Platform.OS === 'android' && res['min-version-android'] > minVersionAndroid) {
        this.setState({
          updateModal: true,
          updateLink: res['url-play-store']
        });
      }
      if (Platform.OS === 'ios' && res['min-version-ios'] > minVersionIos) {
        this.setState({
          updateModal: true,
          updateLink: res['url-ios-store']
        });
      }

      const oneSignalOptions = {
        kOSSettingsKeyInFocusDisplayOption: 0
      };

      OneSignal.init(res['one-signal-app-id-vet'], oneSignalOptions);

      OneSignal.addEventListener('received', this.onReceived);
      OneSignal.addEventListener('opened', this.onOpened);
      OneSignal.addEventListener('ids', this.onIds);

      // Set inFocusDisplaying to prevent the default push notification alert when the is in focus
      // Android ONLY
      OneSignal.inFocusDisplaying(2);
    });
  }


  render() {
    return (
        <> 
          <StatusBar hidden/>

          <AppContainer
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
          />

          <Modal animationType={"slide"}
                 transparent={false}
                 visible={this.state.updateModal}
                 onRequestClose={() => {
                   this.updateModal(false);
                 }}>
            <View style={{
              paddingTop: 100,
              alignSelf: 'center'
            }}>
              <Text style={{
                textAlign: 'center'
              }}>{locales.updateAppTitle}</Text>
              <Text style={{
                textAlign: 'center'
              }}>{locales.updateAppMessage}</Text>
              <TouchableOpacity onPress={
                () => this.helpers.openLink(this.state.updateLink)
              } style={{
                marginTop: 20,
                padding: 10,
                backgroundColor: '#51CBBF',
                color: '#fff',
                alignSelf: 'center'
              }}>
                <Text style={{
                  textAlign: 'center'
                }}>{locales.updateText}</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </>
    )
  }
}
