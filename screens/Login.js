import React, {PropTypes, Component} from 'react';
import {
	Text,
	View,
	Platform,
	Dimensions,
	Image,
	TextInput,
	TouchableOpacity,
	ImageBackground,
	BackHandler,
	I18nManager,
	Alert
} from 'react-native';
import {Container, Content, Right, Header, Left, Body, Form, Icon} from 'native-base';

import {EventRegister} from 'react-native-event-listeners';

// Screen Styles
import styles from './../containers/Signin_05/styles';

// Locales
import locales_es from './../locales/es';
import {wording} from "../models/wording";

// Images
import LogoMeemo from './../assets/images/logomeemoarribaverde.fw.png';

import BgImageVet from './../assets/images/image_bg_signin_five_VET2.jpg';

import AuthService from "../modules/AuthService";
import Helpers from "../modules/Helpers";
import Loading from "../components/loading";
import {USER_TYPE_PET_OWNER, USER_TYPE_SERVICE, USER_TYPE_VET} from "../models/constants";
import Metrics from "../Themes/Metrics";

export default class Login extends Component {

	static navigationOptions = {
		header: null,
		headerMode: 'none'
	};

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			secureTextEntryActivated: true,
			email: 'mkt@meemo.vet',
			password: '123',
			type: [USER_TYPE_VET, USER_TYPE_SERVICE]
		};

		this.auth = new AuthService();
		this.helpers = new Helpers();
	}

	toggle(thisValue) {
		let currentState = this.state[thisValue];
		this.setState({
			[thisValue]: !currentState
		})
	}

	goToRecovery() {
		this.props.navigation.navigate('Recovery');
	}

	goToRegister() {
		this.props.navigation.navigate('RegisterSelect');
	}

	loginAsGuestUser() {
		this.auth.loginAsGuestUser();
		this.successLoginRedirect();
	}

	login() {
		let errors = 0;
		const stateKeys = Object.keys(this.state);
		stateKeys.forEach((key) => {
			if (this.state[key] === '') {
				errors++;
			}
		});
		if (errors) {
			alert(locales_es.completeAllFields);
			return;
		}
		let checkEmail = this.helpers.validateEmail(this.state.email);
		if (!checkEmail) {
			Alert.alert(wording.global.errorTitle, wording.register.errorEmail);
			return;
		}

		this.setState({loading: true});
		console.log("ACA")
		console.log(this.state)
		this.auth.login(this.state)
		  .then(() => {
			  this.setState({loading: false});
			  EventRegister.emit('reload');
			  this.successLoginRedirect();
		  }).catch(err => {
			this.setState({loading: false});
			console.log(err);
			Alert.alert('Error', err.message);
		});
	}

	successLoginRedirect() {
		this.props.navigation.navigate('Home');
	}

	render() {
		return (
		  <Container>
			  <ImageBackground style={styles.imgContainer}
			                   source={BgImageVet}>

				  {this.state.loading ?
					<Loading/>
					: null}

				  <Header style={styles.header}>
					  <Left style={styles.left}></Left>
					  <Body style={styles.body}>
					  {/*<Text style={styles.textTitle}>Iniciar Sesión</Text>*/}
					  </Body>
					  <Right style={styles.right}/>
				  </Header>

				  <Content>
					  <View style={styles.logoSec}>
						  <Image style={styles.imageLogoMountify} source={LogoMeemo}/>
					  </View>
					  <TextInput onChangeText={(text) => this.setState({email: text})}
					             value={this.state.email}
					             style={styles.textInput}
					             placeholder="Email"
					             placeholderTextColor="#b7b7b7"
					             underlineColorAndroid="transparent"
					             autoCapitalize="none"
					             textAlign={I18nManager.isRTL ? 'right' : 'left'}
					             keyboardType="email-address"
					  />

					  <Form>
						  <TextInput onChangeText={(text) => this.setState({password: text})}
						             value={this.state.password}
						             style={styles.textInput}
						             secureTextEntry={this.state.secureTextEntryActivated}
						             blurOnSubmit={false}
						             placeholder="Contraseña"
						             placeholderTextColor="#b7b7b7"
						             underlineColorAndroid="transparent"
						             autoCapitalize="none"
						             textAlign={I18nManager.isRTL ? 'right' : 'left'}
						             keyboardType="default"/>
						  <Icon style={{
							  position: 'absolute',
							  left: Metrics.WIDTH * 0.8,
							  top: 20,
						  }}
						        active name={this.state.secureTextEntryActivated ? 'eye-off' : 'eye'}
						        onPress={() => this.toggle('secureTextEntryActivated')}
						  />
					  </Form>

					  <TouchableOpacity style={styles.buttonSignIn}
					                    onPress={() => this.login()}>
						  <Text style={styles.signInText}>Ingresar</Text>
					  </TouchableOpacity>

					  <Text style={styles.textForgotPsssword} onPress={() => this.goToRecovery()}>¿Olvidaste tu
						  contraseña?</Text>

					  {this.state.type === USER_TYPE_PET_OWNER ?
						<Text style={styles.textForgotPsssword} onPress={() => this.loginAsGuestUser()}>Ingresar como
							invitado</Text>
						: null}

				  </Content>

				  <Text style={styles.textSignUp} onPress={() => this.goToRegister()}>
					  ¿No tenés cuenta? Crear cuenta nueva
				  </Text>


				  {/*<View style={styles.signInWithFbBg}>
                        <FontAwesome name="facebook" size={28} color="#ffffff" />
                        <Text style={styles.signInWithFbText} onPress = {() => alert('Facebook')}>Sign in with facebook</Text>
                    </View>*/}

				  {/*<Text style={styles.textSignUp}>
                        {Config.APP_TYPE}
                    </Text>*/}
			  </ImageBackground>
		  </Container>
		);
	}
}
