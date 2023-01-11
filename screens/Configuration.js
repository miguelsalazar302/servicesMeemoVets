import React, {Component} from 'react';
import {
	Text,
	View,
	Image,
	StatusBar,
	Platform,
	TouchableOpacity,
	BackHandler,
	I18nManager,
	Alert,
	Switch
} from 'react-native';
import {Container, Icon, Content, Spinner, List, ListItem} from 'native-base';
// Screen Styles
import styles from './../containers/Profile/ProfilePayment/styles';
import APIService from "../modules/ApiService";
import AntDesign from "react-native-vector-icons/AntDesign";

import {EventRegister} from 'react-native-event-listeners'

import locales_es from "./../locales/es";

export default class Configuration extends Component {

	static navigationOptions = {
		title: 'Configuración',
		headerTitleStyle: {
			alignSelf: 'center',
			textAlign: 'center'
		},
	};

	constructor() {
		super();

		this.state = {
			normal: undefined,
			extended: undefined,
			urgency: undefined,
			loading: true
		};

		this.api = new APIService();
	}

	componentWillMount() {
		const that = this;
		BackHandler.addEventListener('hardwareBackPress', () => {
			that.props.navigation.navigate('Home');
			return true;
		});

		this.listener = EventRegister.addEventListener('reloadConfiguration', (data) => {
			this.getMySchedules();
		})
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.listener)
	}

	componentDidMount() {
		this.getMySchedules();
	}

	getMySchedules() {
		this.api.getMySchedules().then(res => {
			console.log(res);
			this.getSchedulesCurrentEnabledStatus(res.data);
			this.hideLoading();
		}).catch(err => {
			console.log(err);
			Alert.alert('Error', err.message);
			this.hideLoading();
		})
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

	getSchedulesCurrentEnabledStatus(data) {
		if (!data) return;
		const currentState = this.state;

		// DEFAULT POST-API-CHECK
		currentState.normal = null;
		currentState.extended = null;
		currentState.urgency = null;

		this.setState(currentState, () => {
			data.map(schedule => {
				if (schedule.type === 'normal') {
					currentState.normal = schedule.enabled;
					currentState.normalId = schedule.id;
					currentState.normalData = schedule;
				}
				if (schedule.type === 'extended') {
					currentState.extended = schedule.enabled;
					currentState.extendedId = schedule.id;
					currentState.extendedData = schedule;
				}
				if (schedule.type === 'urgency') {
					currentState.urgency = schedule.enabled;
					currentState.urgencyId = schedule.id;
					currentState.urgencyData = schedule;
				}
			});
			this.setState(currentState);
		});
	}

	onSwitchValueChange(value, target) {
		console.log(value);
		console.log(target);
		const state = this.state;
		state[target] = value;
		state[target + 'Data'].enabled = value;
		this.setState(state);

		this.api.putSchedule(state[target + 'Data'], state[target + 'Id']).then(res => {
			console.log(res);
		}).catch(err => {
			Alert.alert('Error', err.response.data.message);
			state[target] = !value;
			console.log('tu state');
			console.log(state);
			this.setState(state);
		});
	}

	goToAgendaVet(type, scheduleId) {
		this.api.checkMercadoPagoAuthorizationStatus().then(res => {
			console.log(res);
			/*this.setState({
				userData: res.data
			});*/
			this.props.navigation.navigate('AgendaVet', {type, scheduleId, enabled: this.state[type] || true});
			this.hideLoading();
		}).catch(err => {
			const errorMsg = err.response && err.response.data && err.response.data.message
			  ? err.response.data.message : err.message;
			console.log(errorMsg);
			Alert.alert(locales_es.errorModal.title, locales_es.needMPAccount);
			this.goToWallet();
			this.hideLoading();
		});
	}

	goToWallet() {
		this.props.navigation.navigate('Wallet');
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

	showInfoNormal() {
		Alert.alert("Atención Normal", 'Habilita esta opcion para configurar dias, horarios, zonas y honorarios de atención convencionales');
	}

	showInfoExtended() {
		Alert.alert("Atención Extendida", 'Habilita esta opcion para configurar dias, horarios, zonas y honorarios de atención especial como ser dias u horarios no convencionales.');
	}
	
	showInfoIncome() {
		Alert.alert("Cobro de Honorarios", 'Vincula tu cuenta de Mercadopago para poder cobrar tus honorarios');
	}


	render() {
		StatusBar.setBarStyle('light-content', true);
		if (Platform.OS === 'android') {
			StatusBar.setBackgroundColor('transparent', true);
			StatusBar.setTranslucent(true);
		}

		return (
		  this.state.loading ? <Spinner/> :
			<Container style={{backgroundColor: '#2d324f'}}>
				<Content style={styles.slidesec}>
					<List style={styles.details}>
						<ListItem style={styles.listItem}
						          onPress={() => this.goToAgendaVet('normal', this.state.normalId)}>
							<View>
								<Text style={styles.listItemText2}>Atención Normal</Text>
							</View>
							<View style={styles.listRight}>
								{this.state.normal === undefined ? <Spinner/> : null}
								{this.state.normal === undefined ? null : this.state.normal === null ? null :
								
								<View>
								  <Text style={{right:45, top:13, color:"#b7b7b7"}}>{this.state.normal ? "Habilitado" : "Deshabilitado"}</Text>
								  <Switch onValueChange={(value) => this.onSwitchValueChange(value, 'normal')}
								          value={this.state.normal}
										  style={{bottom:10}}/>
								</View>
								}
								<TouchableOpacity>
									<Icon name="ios-arrow-forward" style={styles.arrowForword}/>
								</TouchableOpacity>
							</View>
						</ListItem>

						<ListItem style={styles.listItem}
						          onPress={() => this.goToAgendaVet('extended', this.state.extendedId)}>
							<View>
								<Text style={styles.listItemText2}>Atención Extendida</Text>
							</View>
							<View style={styles.listRight}>
								{this.state.extended === undefined ? <Spinner/> : null}
								{this.state.extended === undefined ? null : this.state.extended === null ? null :
								  <View>
								  <Text style={{right:45, top:13, color:"#b7b7b7"}}>{this.state.extended ? "Habilitado" : "Deshabilitado"}</Text>
								  <Switch onValueChange={(value) => this.onSwitchValueChange(value, 'extended')}
								          value={this.state.extended}
										  style={{bottom:10}}/>
								</View>
								}
								<TouchableOpacity>
									<Icon name="ios-arrow-forward" style={styles.arrowForword}/>
								</TouchableOpacity>
							</View>
						</ListItem>

						<ListItem style={styles.listItem}
						          onPress={() => this.goToWallet()}>
							<View>
								{/* TODO: Implementar llamada de check MP para ajustar el wording del link */}
								<Text style={styles.listItemText2}>Cuenta para Cobro de Honorarios</Text>
							</View>
							<View style={styles.listRight}>
								<TouchableOpacity>
									<Icon name="ios-arrow-forward" style={styles.arrowForword}/>
								</TouchableOpacity>
							</View>
						</ListItem>

						{/*<ListItem style={styles.listItem}
                                  onPress={() => this.goToAgendaVet('urgency', this.state.urgencyId)}>
                            <View>
                                <Text style={styles.listItemText}>Horarios de Atención de Urgencias</Text>
                            </View>
                            <View style={styles.listRight}>
                                {this.state.urgency === undefined ? <Spinner/> : null}
                                {this.state.urgency === undefined ? null : this.state.urgency === null ? null :
                                    <Switch onValueChange={(value) => this.onSwitchValueChange(value, 'urgency')}
                                            value={this.state.urgency}/>
                                }
                                <TouchableOpacity>
                                    <Icon name="ios-arrow-forward" style={styles.arrowForword}/>
                                </TouchableOpacity>
                            </View>
                        </ListItem>*/}

					</List>
				</Content>
			</Container>
		);
	}
}
