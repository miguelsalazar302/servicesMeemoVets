import React, {Component} from "react";
import {
	Text,
	View,
	Image,
	StatusBar,
	TouchableOpacity,
	Platform,
	ImageBackground,
	BackHandler,
	ScrollView,
	I18nManager,
	AsyncStorage, Alert,
} from "react-native";
import {
	Content,
	Container,
	Button,
	Right,
	Segment,
	Header,
	Left,
	Icon,
	Body, Spinner
} from "native-base";
import styles from "./styles";
// import {CachedImage} from "react-native-cached-image";

import {Col, Row, Grid} from "react-native-easy-grid";

import AppStyles from './../../Themes/ApplicationStyles';

import Ionicons from "react-native-vector-icons/Ionicons";


import {parseEventDate} from "../../modules/ViewHelpers";

// IMAGES
import APIService from "../../modules/ApiService";
import {Metrics} from "../../Themes";
import {wording} from "../../models/wording";
import locales_es from "./../../locales/es";
import Helpers from "../../modules/Helpers";
import AuthService from "../../modules/AuthService";
import {
	BOOKING_STATUS_CANCELED,
	BOOKING_STATUS_COMPLETED,
	BOOKING_STATUS_CONFIRMED, BOOKING_STATUS_CREATED,
	BOOKING_STATUS_LABELS, BOOKING_STATUS_PENDING, BOOKING_STATUS_REJECTED, USER_TYPE_VET, USER_TYPE_SERVICE
} from "../../models/constants";
import {EventRegister} from "react-native-event-listeners";

export default class ProfileBooking extends Component {

	static navigationOptions =
	  ({navigation}) => (
		{
			headerLeft: <Icon name="arrow-back"
			                  size={30} color='#ffffff'
			                  style={{paddingLeft: 20, color: "#fff"}}
			                  onPress={() => {
				                  navigation.goBack()
			                  }}/>,
			title: 'Consulta',
			headerTitleStyle: {
				alignSelf: 'center',
				textAlign: 'center'
			},
		});


	constructor(props) {
		super(props);

		this.state = {
			// bookingId: this.props.navigation.getParam('bookingId', 0), // TODO DEBUG
			bookingId: this.props.navigation.getParam('bookingId', 105), // TODO DEBUG
			booking: null,
			petOwner: ""
		};

		this.api = new APIService();
		this.auth = new AuthService();
		this.helpers = new Helpers();
	}

	componentWillMount() {
		BackHandler.addEventListener("hardwareBackPress", () => {
			this.props.navigation.goBack();
			return true;
		});
		this.listener = EventRegister.addEventListener('reloadBookings', (data) => {
			this.load();
		})
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.listener);
	}

	componentDidMount() {
		this.load();

		this.auth.getLocalUserData().then(res => {
			this.setState({
				userId: res.id,
				userType: res.type
			}, () => {
				this.api.getVetStatistics(this.state.userId).then(res => {
					this.setState(res.data);
				});
			});
		}).catch(err => {
			console.log(err);
		});
	}

	showLoading() {
		this.setState({
			booking: null
		});
	};

	load() {
		this.api.getBookingById(this.state.bookingId).then(res => {
			this.setState({
				booking: res.data
			}, () => {
				this.getPet();
				this.getLocationData();
				this.getPetOwnerData();
			})
		}).catch(err => {
			Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
		});
	}

	getLocationData() {
		this.api.getLocationById(this.state.booking.location_id).then(res => {
			this.setState({
				location: res.data
			});
		}).catch(err => {
			Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
		});
	}

	getPetOwnerData() {
		this.api.getUserById(this.state.booking.pet_owner_id).then(res => {
			this.setState({
				petOwner: res.data
			});
		}).catch(err => {
			Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
		});
	}

	getPet() {
		this.api.getPetTypes().then(res => {
			this.setState({
				pet_types: res.data
			}, () => {
				this.api.getPetGenders().then(res => {
					this.setState({
						pet_genders: res.data
					}, () => {
						this.api.getPet(this.state.booking.pet_id).then(res => {
							this.setState({
								pet: res.data
							});
							console.log(res);
						}).catch(err => {
							Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
						})
					});
				});

			});
		}).catch(err => {
			Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
		});
	}

	goToPetOwnerProfile(petOwnerId) {
		this.props.navigation.navigate('ProfilePetOwner', {userId: petOwnerId})
	}

	goToPetProfile(petId) {
		this.props.navigation.navigate('ProfilePet', {petId})
	}

	getPetGender(id) {
		const result = this.state.pet_genders.filter(item => Number(item.id) === Number(id));
		return result.length ? result[0].name : '';
	}

	getPetType(id) {
		const result = this.state.pet_types.filter(item => Number(item.id) === Number(id));
		return result.length ? result[0].name : '';
	}

	openMap() {
		// const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
		const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
		const latLng = `${this.state.location.lat},${this.state.location.lng}`;
		const label = 'Lugar de Consulta';
		const url = Platform.select({
			ios: `${scheme}${label}@${latLng}`,
			android: `${scheme}${latLng}(${label})`
		});
		// alert(JSON.stringify(url));
		this.helpers.openLink(url, false).catch((err) => {
			this.props.navigation.navigate('Map', {
				markerLat: this.state.location.lat,
				markerLng: this.state.location.lng,
			})
		});
	}

	confirmCancelBooking() {
		Alert.alert(
		  '¿Cancelar servicio?',
		  '¿Está seguro de querer cancelar este servicio?',
		  [
			  {
				  text: 'Sí, cancelar servicio.',
				  onPress: () => {
					  this.cancelBooking()
				  }
			  },
			  {
				  text: 'No, no cancelar.',
				  onPress: () => console.log('Cancel Pressed'),
				  style: 'cancel',
			  },
		  ],
		  {cancelable: false},
		);
	}

	cancelBooking() {
		const obj = {
			id: this.state.booking.id,
			status: BOOKING_STATUS_REJECTED
		};
		this.showLoading();
		this.api.putBooking(obj).then(res => {
			this.load();
		}).catch(err => {
			console.log(err);
			const errorMsg = err.response && err.response.data && err.response.data.message
			  ? err.response.data.message : err.message;
			Alert.alert(wording.global.errorTitle, errorMsg);
			this.hideLoading();
		})
	}

	goToCloseConsultation() {
		this.props.navigation.navigate('AppointmentClose', {
			booking_id: this.state.booking.id,
			pet_id: this.state.booking.pet_id,
		});
	}

	goToProfileAppointmentClose() {
		this.props.navigation.navigate('ProfileAppointmentClose', {
			booking_id: this.state.booking.id,
			pet_id: this.state.booking.pet_id,
		});
	}

	finishBooking(bookingId) {
		const obj = {
			id: bookingId,
			status: BOOKING_STATUS_COMPLETED
		};
		this.api.putBooking(obj).then(res => {
			RNRestart.Restart();
		}).catch(err => {
			console.log(err);
			const errorMsg = err.response && err.response.data && err.response.data.message
			  ? err.response.data.message : err.message;
			Alert.alert(wording.global.errorTitle, errorMsg);
		})
	}

	render() {

		StatusBar.setBarStyle("light-content", true);

		if (Platform.OS === "android") {
			StatusBar.setBackgroundColor("#0e1130", true);
			StatusBar.setTranslucent(true);
		}

		const {booking, pet, location} = this.state;

		return (
		  <Container>
			  <ScrollView>
				  {booking === null ? <Spinner/> :
					booking ?
					  <View style={{
						  paddingTop: 20
					  }}>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Motivo de Consulta:
							  </Text>
						  </View>
						  <View style={styles.tandc}>
							  <Text>{this.state.booking.reason}</Text>
						  </View>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Estado:
							  </Text>
						  </View>
						  <View style={styles.tandc}>
							  <Text>{BOOKING_STATUS_LABELS[this.state.booking.status]}</Text>
						  </View>

						  {booking.date ?
							<View>
								<View style={styles.tandc}>
									<Text style={styles.separatorText}>
										Fecha confirmada:
									</Text>
								</View>
								<View style={styles.tandc}>
									<Text>{parseEventDate(booking.date, false, '', true)}</Text>
								</View>
								<View style={{height: 10}}/>
							</View>
							: booking.suggested_date ?
							  <View>
								  <View style={styles.tandc}>
									  <Text style={styles.separatorText}>
										  Fecha sugerida:
									  </Text>
								  </View>
								  <View style={styles.tandc}>
									  <Text>{parseEventDate(booking.suggested_date, false, '', true)}</Text>
								  </View>
								  <View style={{height: 10}}/>
							  </View>
							  : null
						  }

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Lugar de Consulta:
							  </Text>
						  </View>
						  <View style={styles.tandc}>
							  {location ?
								<View>
									<View style={styles.tandc}>
										<Text style={{textAlign:'center'}}>{location.address}</Text>
									</View>
									<View style={styles.tandc}>
										<Text style={{textAlign:'center'}}>{location.reference}</Text>
									</View>
									<TouchableOpacity style={AppStyles.buttonSignIn}
									                  onPress={() => this.openMap()}>
										<Text style={AppStyles.signInText}>Ver en el mapa</Text>
									</TouchableOpacity>
								</View>
								: <Spinner/>}
						  </View>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Mascota:
							  </Text>
							  <View style={{height: 80}}/>
						  </View>
						  <View style={styles.tandc}>
							  {pet ?
							    <TouchableOpacity onPress={() => this.goToPetProfile(pet.id)}>

								    <View style={styles.rowBg}>
									    <View style={styles.rowHeaderView}>
										    <Image
											  style={styles.profileImg}
											  source={{uri: pet.full_profile_image}}
										    />
										    <View style={styles.rowHeaderNameView}>
											    <Text style={styles.rowNameTxt}>{pet.name}</Text>
											    <Text
												  style={styles.rowTimeTxt}>{this.getPetType(pet.pet_type_id)}</Text>
											    <Text
												  style={styles.rowTimeTxt}>{this.getPetGender(pet.pet_gender_id)}</Text>
										    </View>
									    </View>
									    <View style={styles.dividerHorizontal}/>
									    <View style={{height: 10}}/>
								    </View>
							    </TouchableOpacity>

							    : <Spinner/>
							  }
						  </View>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Dueño:
							  </Text>
							  <View style={{height: 80}}/>
						  </View>
						  <View style={styles.tandc}>
							  {booking ?
								<View>
									<TouchableOpacity onPress={() => this.goToPetOwnerProfile(booking.pet_owner_id)}>

										<View style={styles.rowBg}>
											<View style={styles.rowHeaderView}>
												<Image
												  style={styles.profileImg}
												  source={{uri: booking.pet_owner_full_profile_image}}
												/>
												<View style={styles.rowHeaderNameView}>
													<Text
													  style={styles.rowNameTxt}>
														{booking.pet_owner_name} {booking.pet_owner_lastname}
													</Text>
													<Text style={styles.rowDescTxt}>{booking.pet_owner_email}</Text>
													<Text style={styles.rowDescTxt}>{this.state.petOwner.cell_phone}</Text>
												</View>
											</View>
										</View>
									</TouchableOpacity>
								</View>
								: <Spinner/>
							  }
						  </View>

						  <View style={{height: 50}}/>

						  {booking.status === BOOKING_STATUS_CONFIRMED &&
						  <View style={styles.tandc}>
							    <View>
									<TouchableOpacity
										onPress={() => this.state.userType == USER_TYPE_VET ? this.goToCloseConsultation(item.id, item.pet_id) : this.finishBooking(item.id)}>
										<Text style={AppStyles.listCardsRowButton}>{this.state.userType == USER_TYPE_VET ? "Completar HC" : "Marcar Finalizado"}</Text>
									</TouchableOpacity>
							    </View>
						  </View> }

						  {booking.status === BOOKING_STATUS_CREATED &&
						  <View style={styles.tandc}>
							    <View>
								    <TouchableOpacity style={AppStyles.buttonSignIn}
								                      onPress={() => this.confirmCancelBooking()}>
									    <Text style={AppStyles.signInText}>Cancelar Consulta</Text>
								    </TouchableOpacity>
							    </View>
						  </View> }

						  {booking.status === BOOKING_STATUS_COMPLETED &&
						  <View style={styles.tandc}>
							  <View>
								  <TouchableOpacity style={AppStyles.buttonSignIn}
								                    onPress={() => this.goToProfileAppointmentClose()}>
									  <Text style={AppStyles.signInText}>Historia Clínica</Text>
								  </TouchableOpacity>
							  </View>
						  </View> }
					  </View>
					  :
					  <View>
						  <View style={{
							  paddingTop: 20
						  }}>
							  <View style={styles.addressTextBg}>
								  <Text
									style={[
										styles.addressText,
										{
											color: '#111111',
											paddingBottom: Metrics.HEIGHT * 0.01,
											textAlign: 'center',
											width: Metrics.WIDTH
										},
									]}>
									  Error al cargar la consulta.
								  </Text>
							  </View>
						  </View>
					  </View>
				  }
			  </ScrollView>
		  </Container>
		);
	}
}
