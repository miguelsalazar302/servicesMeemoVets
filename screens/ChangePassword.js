
import React, { Component } from 'react';
import {Text, View, Image, StatusBar, Platform, TouchableOpacity, BackHandler, I18nManager, Alert, TextInput} from 'react-native';
import { Container,  Icon, Right,   Header,   Left, Body, Title, Content, Form,List, ListItem} from 'native-base';
import Swiper from 'react-native-swiper';
// Screen Styles
import styles from './../containers/Profile/ProfilePayment/styles';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AuthService from "../modules/AuthService";
import {wording} from "../models/wording";
import locales_es from "../locales/es";
import Loading from "../components/loading";

export default class ChangePassword extends Component {

    static navigationOptions = {

    };

    constructor(props) {
        super(props);
        this.state = {
            isMessageActive: true,
            isFollowed: false,
            password: '',
            password_repeat: ''
        };

        this.auth = new AuthService();
    }
    componentWillMount() {
        const that = this;
        BackHandler.addEventListener('hardwareBackPress', function() {
            // that.props.navigation.navigate('Home')
            that.props.navigation.navigate('Profile');
            return true;
        });
    }
    componentDidMount() {
        this.auth.getRemoteUserData()
            .then((res) => {
                this.setState({
                    full_profile_image: res.data.full_profile_image + '?cache=' + new Date().getTime(),
	                name: res.data.name,
	                lastname: res.data.lastname,
	                identification: res.data.identification,
                })
            }).catch(err => {
            Alert.alert('Error', err.message);
        });
    }

    setPassword() {
        let errors = 0;
        const stateKeys = Object.keys(this.state);
        stateKeys.forEach((key) => {
            if(this.state[key] === '') {
                errors++;
            }
        });
        if(errors){
            // TODO: Revisar wordings en dos lugares distintos
            Alert.alert(wording.global.errorTitle, locales_es.completeAllFields);
            return;
        }
        if (this.state.password !== this.state.password_repeat){
            Alert.alert(wording.global.errorTitle, wording.register.errorPasswordRepeatNotMatched);
            return;
        }

        this.setState({loading: true});
        const user = {
	        name: this.state.name,
	        lastname: this.state.lastname,
	        password: this.state.password,
	        identification: this.state.identification,
        };
        this.auth.updateUser(user)
            .then((res) => {
                this.setState({loading: false});
                this.props.navigation.goBack();
                Alert.alert('Éxito', res.message);
            }).catch(err => {
            this.setState({loading: false});
            Alert.alert('Error', err.message);
        });
        // alert('Registro');
    }
    render(){
        StatusBar.setBarStyle('light-content', true);
        if(Platform.OS === 'android') {
            StatusBar.setBackgroundColor('transparent',true);
            StatusBar.setTranslucent(true);
        }

        return(
            <Container style={{backgroundColor: '#2d324f'}}>
                {this.state.loading ?
                    <Loading />
                    : null}
                <Content style={styles.slidesec}>
                    <View style={styles.profileHeaderMainTextOnly}>
                        <Text style={styles.name}>Cambiar Contraseña</Text>
                    </View>


                    <List>
                        <ListItem>
                                <TextInput onChangeText={(text) => this.setState({password: text})}
                                           value={this.state.password}
                                           style={styles.textInput}
                                           secureTextEntry = {true}
                                           placeholder = "Contraseña Nueva"
                                           placeholderTextColor = "#a7a7a7"
                                           underlineColorAndroid = "transparent"
                                           autoCapitalize = "none"
                                           textAlign={I18nManager.isRTL ? 'right' : 'left'}
                                           keyboardType = "default"/>
                        </ListItem>
                        <ListItem>
                            <TextInput onChangeText={(text) => this.setState({password_repeat: text})}
                                       value={this.state.password_repeat}
                                       style={styles.textInput}
                                       secureTextEntry = {true}
                                       placeholder = "Repetir Contraseña Nueva"
                                       placeholderTextColor = "#a7a7a7"
                                       underlineColorAndroid = "transparent"
                                       autoCapitalize = "none"
                                       textAlign={I18nManager.isRTL ? 'right' : 'left'}
                                       keyboardType = "default"/>
                        </ListItem>

                        <ListItem style={styles.listFooter}
                                  onPress={()=> this.setPassword()}>
                            <Text style={styles.listFooterText}>Enviar</Text>
                        </ListItem>

                    </List>
                </Content>
            </Container>

        );
    }
}
