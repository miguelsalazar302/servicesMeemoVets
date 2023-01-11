import React from 'react';
import {
    ActivityIndicator, 
    StatusBar,
    View,
} from 'react-native';
import Loading from "../components/loading";
import {USER_TYPE_VET, userDataLocalStorage} from "../models/constants";
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthLoading extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        let userData = await AsyncStorage.getItem(userDataLocalStorage);
        userData = JSON.parse(userData);
        console.log('USER DATA:');
        console.log(userData);

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away. 
            this.props.navigation.navigate(userData && userData.token ? 'Main' : 'Auth'); 
        // TODO DEBUG
        // this.props.navigation.navigate(userData && userData.token ? 'MyAppointments' : 'Auth');
        // this.props.navigation.navigate(userData && userData.token ? 'ProfileAppointmentClose' : 'Auth');
        // this.props.navigation.navigate(startPoint)
    };

    // Render any loading content that you like here
    render() {
        return (
            <Loading />
        );
    }
}

export default AuthLoading;