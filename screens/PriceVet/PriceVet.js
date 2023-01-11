import React, {Component} from 'react';
import {
	TouchableHighlight,
	Text, TextInput, View, Image, StatusBar, Platform, TouchableOpacity, BackHandler, I18nManager, Alert, AsyncStorage
} from 'react-native';
import {Container, Icon, Input, Content, Button} from 'native-base';
// Screen Styles
import styles from './styles.js';
import AppStyles from '../../Themes/ApplicationStyles';
import APIService from "../../modules/ApiService";
import Loading from "../../components/loading";

import { EventRegister } from 'react-native-event-listeners'
import {configDataLocalStorage} from "../../models/constants";
import AuthService from "../../modules/AuthService";
import locales_es from "../../locales/es";

export default class PriceVet extends Component {

    static navigationOptions =
        ({navigation}) => (
            {
                headerLeft: <Icon name="arrow-back"
                                  size={30} color='#ffffff'
                                  style={{paddingLeft: 20, color: "#fff"}}
                                  onPress={() => {
                                      navigation.goBack()
                                  }}/>,
                title: 'Tarifa / Honorarios',
                headerTitleStyle: {
                    alignSelf: 'center',
                    textAlign: 'center'
                },
            });

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            errors: [],
            price: '',
            finalPrice: '',
            commission: 0,
            enabled: true
        };

        this.api = new APIService();
        this.auth = new AuthService();
    }

    componentWillMount() {
        const that = this;
        BackHandler.addEventListener('hardwareBackPress', () => {
            that.props.navigation.navigate('Configuration');
            return true;
        });
    }

    componentDidMount() {
        const defaultValue = undefined;
        const type = this.props.navigation.getParam('type', defaultValue);
        const scheduleId = this.props.navigation.getParam('scheduleId', defaultValue);
        // const scheduleId = 1;
        const agenda = this.props.navigation.getParam('agenda', defaultValue);
        const location = this.props.navigation.getParam('location', defaultValue);
        const enabled = this.props.navigation.getParam('enabled', true);

        this.setState({
            type,
            scheduleId,
            agenda,
            location,
            enabled
        });

        if(scheduleId) {
            this.setState({
                loading: true
            });
            this.api.getScheduleById(scheduleId).then(res => {
                console.log("ACA")
                console.log(res);
                if(res.data && res.data.price) {
                    this.setState({
                        priceAux: res.data.price
                    })
                    this.parsePriceAndSetInitialState(res.data.price);
                }
            }).catch(err => {
                console.log(err);
            });
        }

        this.auth.getAndSaveRemoteConfigData().then(res => {
            console.log('auth getLocalConfigData');
            console.log(res);
            const commission = this.parseCommissionForView(res.commission);
            this.setState({
                commission
            });
        }).catch(err => {
            console.log(err);
        });
    }

    parseCommissionForView(commission) {
        return (commission / 100) + 1;
    }

    parsePriceAndSetInitialState(price) {
        this.calculatePrices(price);
        this.setState({
            loading: false
        });
    }

    calculatePrices(value) {
        const _finalPrice = Math.ceil(Number(value) * this.state.commission);
        if (isNaN(_finalPrice)) {
            Alert.alert('Ingrese un precio válido usando puntos');
            return;
        }
        this.setState({
            price: value,
            finalPrice: String('$' + _finalPrice)
        });
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

    send() {
        if (!this.state.price) {
            const errors = JSON.parse(JSON.stringify(this.state.errors));
            Alert.alert('Hubo un error', 'Complete el precio de su tarifa');
            errors.push('price');
            this.setState({
                errors
            });
            return;
        }
        if (this.state.scheduleId) {
            this.showLoading();
            this.api.putSchedule(this.state, this.state.scheduleId).then(res => {
                this.hideLoading();
                console.log(res);
                Alert.alert('Éxito', "Su configuración se ha guardado");
                EventRegister.emit('reloadConfiguration', 'it works!!!');
	            this.api.checkMercadoPagoAuthorizationStatus().then(res => {
		            console.log(res);
		            /*this.setState({
						userData: res.data
					});*/
		            this.props.navigation.navigate('Configuration');
		            this.hideLoading();
	            }).catch(err => {
		            const errorMsg = err.response && err.response.data && err.response.data.message
		              ? err.response.data.message : err.message;
		            console.log(errorMsg);
		            Alert.alert(locales_es.errorModal.title, locales_es.needMPAccount);
		            this.goToWallet();
		            this.hideLoading();
	            });
            }).catch(err => {
                this.hideLoading();
                console.log(err);
                Alert.alert('Hubo un error', err.response.data.message);
            });
        } else {
            this.showLoading();
            this.api.postSchedule(this.state).then(res => {
                this.hideLoading();
                Alert.alert('Éxito', "Su configuración se ha guardado");
                EventRegister.emit('reloadConfiguration', 'it works!!!');
                this.props.navigation.navigate('Configuration');
            }).catch(err => {
                this.hideLoading();
                Alert.alert('Hubo un error', err.response.data.message);
            });
        }
    }

	goToWallet() {
		this.props.navigation.navigate('Wallet');
	}

    render() {
        StatusBar.setBarStyle('light-content', true);
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor('transparent', true);
            StatusBar.setTranslucent(true);
        }
        StatusBar.setHidden(true);
        return (
            <Container style={{backgroundColor: '#2d324f'}}>
                {this.state.loading ? <Loading/> :
                    <Content bounces={true}>
                        <View style={styles.pageContent}>
                            <Text style={styles.darkTextStyleBig}>
                            Este es el precio mínimo para la reserva de tus servicios. 
                            Introduce el precio de tus honorarios si eres veterinario o la tarifa del servicio básico si prestas un servicio no veterinario. 
                            El precio no debe incluir eventuales adicionales o materiales que deberán cobrarse aparte.
                            </Text>
                            {/*<Text style={styles.textInputStyle}>Tu Precio</Text>*/}
                            <TextInput onChangeText={value => this.calculatePrices(Number(value))}
                                       value={this.state.price}
                                       style={[AppStyles.forms.textInput,
                                           this.state.errors.map((k) => {
                                               if (k === 'price') {
                                                   return AppStyles.forms.textInputError;
                                               }
                                           })]}
                                       placeholder="Nuevo Precio"
                                       placeholderTextColor="#b7b7b7"
                                       underlineColorAndroid="transparent"
                                       autoCapitalize="words"
                                       keyboardType="numeric"
                            />
                            <Text style={styles.lightTextStyle}>
                                Este es el precio que ingresaste anteriormente
                            </Text>
                            <Input
                                style={styles.textInputStyle}
                                value={this.state.priceAux == undefined ? "No Ingresado" : String('$' + this.state.priceAux)}
                                editable={false}
                                keyboardType="numeric"
                                placeholderTextColor="#b7b7b7"
                                placeholder="No ingresado"
                                textAlign={I18nManager.isRTL ? "center" : "center"}
                            />
                            <Text style={styles.lightTextStyle}>
                                Este será el precio que veran tus clientes
                            </Text>
                            <Input
                                style={styles.textInputStyle}
                                value={this.state.finalPrice == undefined ? "No Ingresado" : this.state.finalPrice}
                                editable={false}
                                keyboardType="numeric"
                                placeholderTextColor="#b7b7b7"
                                placeholder="Precio Final"
                                textAlign={I18nManager.isRTL ? "center" : "center"}
                            />
                            <TouchableHighlight info>
                                <Button style={styles.buttonStyle} onPress={() => this.send()}>
                                    <Text style={styles.buttonText}>Terminar</Text>
                                </Button>
                            </TouchableHighlight>
                        </View>
                    </Content>
                }
            </Container>
        );
    }
}
