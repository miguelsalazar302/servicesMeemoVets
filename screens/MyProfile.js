import React, { Component } from 'react';
import {Text, View, Image, StatusBar, Platform, TouchableOpacity, BackHandler, I18nManager, Alert} from 'react-native';
import { Container,  Icon, Content, List, ListItem} from 'native-base';

// Screen Styles
import styles from './../containers/Profile/ProfilePayment/styles';
import AuthService from "../modules/AuthService";
import ChangePassword from "./ChangePassword";
import ImagePicker from 'react-native-image-picker';
import APIService from "../modules/ApiService";
import { EventRegister } from 'react-native-event-listeners'

export default class ProfilePayment extends Component {

    static navigationOptions = {

    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isMessageActive: true,
            isFollowed: false,
            avatarSource: null
        };

        this.auth = new AuthService();
        this.api = new APIService();
    }
    componentWillMount() {
        const that = this;
        BackHandler.addEventListener('hardwareBackPress', () => {
            that.props.navigation.navigate('Home');
            return true;
        });
    }

    goToChangePassword() {
        this.props.navigation.navigate('ChangePassword');
    }

    goToMyAccount() {
        this.props.navigation.navigate('ProfileVet');
    }

    componentDidMount() {
        this.auth.getRemoteUserData()
            .then((res) => {
                this.setState({
                    full_profile_image: res.data.full_profile_image + '?cache=' + new Date().getTime(),
                    name: res.data.name,
                    lastname: res.data.lastname,
                })
            }).catch(err => {
                Alert.alert('Error', err.message);
            });
    }

    logout() {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de querer cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Cerrar Sesión',
                    onPress: () => {
                        this.auth.logout();
                        this.props.navigation.navigate('Login');
                    }
                },
            ],
            {cancelable: false},
        );
    }

    selectProfileImage() {
        // More info on all the options is below in the API Reference... just some common use cases shown here
        const options = {
            title: 'Cambiar foto de perfil...',
            cancelButtonTitle: 'Cancelar',
            takePhotoButtonTitle: 'Sacar una foto',
            chooseFromLibraryButtonTitle: 'Elegir de la galería de fotos',
            /*customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],*/
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info in the API Reference)
         */
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source,
                    avatarSourceResponseData: response.data
                });
                this.uploadPhoto();

            }
        });
    }

    uploadPhoto = () => {
        this.api.updateProfileImage(this.state.avatarSourceResponseData).then((res) => {
            console.log(res);
            EventRegister.emit('reload', 'it works!!!');
            // Alert.alert('Éxito', res);
        }).catch((err) => {
            console.log(err);
            EventRegister.emit('reload', 'it works!!!');
            // Alert.alert('Error', err);
        });
    };

    render(){
        StatusBar.setBarStyle('light-content', true);
        if(Platform.OS === 'android') {
            StatusBar.setBackgroundColor('transparent',true);
            StatusBar.setTranslucent(true);
        }

        return(
            <Container style={{backgroundColor: '#2d324f'}}>
                <Content style={styles.slidesec}>
                    <View style={styles.profileHeaderMain}>
                        <View style={styles.profileImageSec}>
                            <TouchableOpacity onPress={()=> this.selectProfileImage()}>
                                <Image source={this.state.avatarSource || {uri:this.state.full_profile_image}}
                                       style={styles.profileImage}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.name}>{this.state.name || 'Hola!'} {this.state.lastname || 'Bienvenido'}</Text>
                    </View>


                    <List style={styles.details}>

                        <ListItem style={styles.listItem} onPress={() => this.goToMyAccount()}>
                            <View>
                                <Text style={styles.listItemText}>Mi Cuenta</Text>
                            </View>
                            <View style={styles.listRight}>
                                <Text style={styles.listRightEmail}>{this.state.email}</Text>
                                <TouchableOpacity>
                                    <Icon name="ios-arrow-forward" style={styles.arrowForword}/>
                                </TouchableOpacity>
                            </View>
                        </ListItem>

                        <ListItem style={styles.listItem} onPress={()=> this.goToChangePassword()}>
                            <View>
                                <Text style={styles.listItemText}>Cambiar Contraseña</Text>
                            </View>
                            <View style={styles.listRight}>
                                <TouchableOpacity>
                                    <Icon name="ios-arrow-forward" style={styles.arrowForword}/>
                                </TouchableOpacity>
                            </View>
                        </ListItem>

                        <ListItem style={styles.listFooter}
                                  onPress={()=> this.logout()}>
                            <Text style={styles.listFooterText}>Cerrar Sesión</Text>
                        </ListItem>

                    </List>
                </Content>
            </Container>

        );
    }
}
