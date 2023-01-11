import React, {Component} from 'react';
import {
	TouchableHighlight,
	Text, TextInput, View, Image, StatusBar, Platform, TouchableOpacity, BackHandler, I18nManager, Alert
} from 'react-native';
import {Container, Icon, Input, Content, Button} from 'native-base';
// Screen Styles
import styles from './styles.js';
import AppStyles from '../../Themes/ApplicationStyles';
import APIService from "../../modules/ApiService";
import Loading from "../../components/loading";

import logoMP from './../../assets/images/logo-mp.png';

import {WebView} from 'react-native-webview';
import {wording} from "../../models/wording";

export default class Wallet extends Component {

	static navigationOptions =
	  ({navigation}) => (
		{
			headerLeft: <Icon name="arrow-back"
			                  size={30} color='#ffffff'
			                  style={{paddingLeft: 20, color: "#fff"}}
			                  onPress={() => {
				                  navigation.goBack()
			                  }}/>,
			title: 'Configuración de Cobros',
			headerTitleStyle: {
				alignSelf: 'center',
				textAlign: 'center'
			},
		});

	webview = null;

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			webview: '',
			errors: [],
			userData: null
		};

		this.api = new APIService();
	}

	componentWillMount() {
		const that = this;
		BackHandler.addEventListener('hardwareBackPress', () => {
			that.props.navigation.navigate('Configuration');
			return true;
		});
	}

	componentDidMount() {
		this.load();
		this.api.getMPExpireDate().then(res => {
			console.log(res.data)
			this.tDate(res.data[0].expire_at)
		});
	}

	load() {
		this.showLoading();
		this.api.checkMercadoPagoAuthorizationStatus().then(res => {
			this.setState({
				userData: res.data
			});
			this.hideLoading();
		}).catch(err => {
			const errorMsg = err.response && err.response.data && err.response.data.message
			  ? err.response.data.message : err.message;
			console.log(errorMsg);
			// Alert.alert(wording.global.errorTitle, errorMsg);
			this.hideLoading();
		});
	}

	tDate(current) {
		var Today = new Date();
	
		if (new Date(current).getTime() <= Today.getTime()) {
			
			this.setState({
				expired: true,
				expire_at: current, 
			})

			return true;
		}

		this.setState({
			expired: false,
			expire_at: current, 
		})


		return false;
	}

	showLoading() {
		this.setState({
			loading: true
		});
	}

	hideLoading() {
		this.setState({
			loading: false
		});
	}

	authorize() {
		this.api.getMercadoPagoAuthorization().then(res => {
			console.log(res);
			this.setState({
				webview: res.data.url
			});
		}).catch(err => {
			console.log(err.response.data.message);
			const errorMsg = err.response && err.response.data && err.response.data.message
			  ? err.response.data.message : err.message;
			Alert.alert(wording.global.errorTitle, errorMsg);
		});
	}

	handleWebViewNavigationStateChange(newNavState) {
		// newNavState looks something like this:
		// {
		//   url?: string;
		//   title?: string;
		//   loading?: boolean;
		//   canGoBack?: boolean;
		//   canGoForward?: boolean;
		// }
		const { url } = newNavState;
		if (!url) return;

		console.log('webview URL:');
		console.log(url);

		// handle certain doctypes
		if (url.includes('.pdf')) {
			this.webview.stopLoading();
			// open a modal with the PDF viewer
		}

		// one way to handle a successful form submit is via query strings
		if (url.includes('?meemompresult=success')) {
			this.webview.stopLoading();
			// maybe close this view?
			Alert.alert(wording.global.successTitle, 'Cuenta vinculada con éxito');
			this.unloadWebview();
			this.forceUpdate();
		}

		// one way to handle errors is via query string
		if (url.includes('?meemompresult=error')) {
			this.webview.stopLoading();
			const errorMsg = 'Hubo un error al vincular su cuenta.';
			Alert.alert(wording.global.errorTitle, errorMsg);
		}

		// redirect somewhere else
		if (url.includes('docs/getting-started')) {
			/*const newURL = 'https://facebook.github.io/react-native/';
			const redirectTo = 'window.location = "' + newURL + '"';
			this.webview.injectJavaScript(redirectTo);*/
		}
	}

	unloadWebview() {
		this.load();
		this.setState({
			webview: ''
		});
	}

	render() {
		StatusBar.setBarStyle('light-content', true);
		if (Platform.OS === 'android') {
			StatusBar.setBackgroundColor('transparent', true);
			StatusBar.setTranslucent(true);
		}
		StatusBar.setHidden(true);
		return (
		  <Container>
			  {this.state.webview ?
				<WebView style={AppStyles.webview}
				         ref={ref => (this.webview = ref)}
				         onNavigationStateChange={this.handleWebViewNavigationStateChange.bind(this)}
				         source={{uri: this.state.webview}}/> :
				this.state.loading ? <Loading/> :
				  <Content bounces={true}>
					  {this.state.userData ?
						<View style={styles.pageContent}>
							<Image source={logoMP} resizeMode={'contain'} style={styles.pageContentImageLogo}/>
							<Text style={styles.pageContentText}>Sus cobros se han vinculado a la siguiente cuenta de
								MercadoPago:</Text>
							<Text style={styles.pageContentText}>{this.state.userData.nickname}</Text>
							<Button style={AppStyles.button} onPress={() => this.authorize()}>
								<Text style={AppStyles.buttonText}>Vincular cuenta</Text>
							</Button>
							<Text style={styles.pageContentTextWarn}>{`Fecha de renovacion: ${this.state.expire_at}`}</Text>
							<Text style={styles.pageContentText}>Por disposición de MercadoPago y para preservar tu seguridad, deberás renovar de forma manual la vinculación con tu cuenta tocando el boton "Vincular Cuenta" cuando se cumpla la fecha de renovación</Text>
						</View>
						:
						<View style={styles.pageContent}>
							<Image source={logoMP} resizeMode={'contain'} style={styles.pageContentImageLogo}/>
							<Text style={styles.pageContentText}>Utilizamos Mercado Pago para todas las transacciones del sitio.</Text>
							<Text style={styles.pageContentText}>Para operar con nosotros necesita vincular su cuenta de Mercado Pago.</Text>
							<Text style={styles.pageContentText}>No ha configurado ninguna cuenta para sus cobros.</Text>
							<Button style={styles.buttonStyle} onPress={() => this.authorize()}>
								<Text style={styles.buttonText}>Vincular cuenta</Text>
							</Button>
						</View>
					  }
				  </Content>
			  }
		  </Container>
		);
	}
}
