import React, { PropTypes, Component } from 'react';
import { Alert, Text, View, Platform, Dimensions, Image, TextInput, TouchableOpacity, ImageBackground, BackHandler,I18nManager} from 'react-native';
import { Grid, Container, Content, Right, Header, Left, Body, Spinner} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// Screen Styles
import styles from './../containers/Signin_05/styles';

// Images
import LogoMeemo from './../assets/images/logomeemoarribaverde.fw.png';
import BgImagePetOwner from './../assets/images/login-bg.jpg';
import BgImageVet from './../assets/images/image_bg_signin_five_VET2.jpg';
import AuthService from "../modules/AuthService";
import Helpers from "../modules/Helpers";

import { wording } from './../models/wording';
import APIService from "../modules/ApiService";
import Loading from "../components/loading";

import {USER_TYPE_PET_OWNER, USER_TYPE_VET} from "../models/constants";

export default class Recovery extends Component {

    static navigationOptions = {
        header: null,
        headerMode: 'none'
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            email: '',
        };

        this.auth = new AuthService();
        this.api = new APIService();
        this.helpers = new Helpers();
    }

    goToLogin() {
        this.props.navigation.navigate('Login');
    }

    recover(){
        console.log(this.state);
        if (!this.state.email){
            Alert.alert(wording.global.errorTitle, wording.register.errorEmailEmpty);
            return;
        }
        let checkEmail = this.helpers.validateEmail(this.state.email);
        if (!checkEmail){
            Alert.alert(wording.global.errorTitle, wording.register.errorEmail);
            return;
        }
        this.setState({loading: true});

        this.auth.passwordRequest(this.state.email)
            .then((res) => {
                console.log(res);
                this.setState({loading: false});
                Alert.alert(wording.global.successTitle, res.message);
                this.goToLogin();
            }).catch(err => {
            console.log(err);
            this.setState({loading: false});
            Alert.alert(wording.global.errorTitle, err.message);
        });
    }

    render() {
        return (
            <Container>
                <ImageBackground style={styles.imgContainer}
                                 source={BgImageVet}>

                    {this.state.loading ?
                        <Loading />
                        : null}
                    <Header style={styles.header}>
                        <Left style={styles.left}>
                            <TouchableOpacity style={styles.backArrow} onPress={()=> this.goToLogin()}>
                                <FontAwesome name={I18nManager.isRTL ? "angle-right" : "angle-left"} size={30} color="#fff"/>
                            </TouchableOpacity>
                        </Left>
                        <Body style={styles.body}>
                        <Text style={styles.textTitle}>Recuperar Cuenta</Text>
                        </Body>
                        <Right style={styles.right}/>
                    </Header>

                    <Content>
                        <View style={styles.logoSec}>
                            <Image style={styles.imageLogoMountify} source={LogoMeemo}/>
                        </View>
                        <Text style = {styles.signInText}>Ingresa tu dirección de correo electrónico</Text>
                        <TextInput onChangeText={(text) => this.setState({email: text})}
                                   /*onBlur={() => this.helpers.validateEmail()}*/
                                   value={this.state.email}
                                   style={styles.textInput}
                                   placeholder = "Email"
                                   placeholderTextColor = "#b7b7b7"
                                   underlineColorAndroid = "transparent"
                                   autoCapitalize = "none"
                                   textAlign={I18nManager.isRTL ? 'right' : 'left'}
                                   keyboardType = "email-address"/>

                        <TouchableOpacity style = {styles.buttonSignIn} onPress = {() => this.recover()}>
                            <Text style = {styles.signInText}>Reestablecer Contraseña</Text>
                        </TouchableOpacity>

                    </Content>

                </ImageBackground>
            </Container>
        );
    }
}
