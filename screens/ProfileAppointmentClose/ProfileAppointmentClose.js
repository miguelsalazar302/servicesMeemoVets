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


import ImageView from "react-native-image-viewing";


import {parseEventDate} from "../../modules/ViewHelpers";

// IMAGES
import APIService from "../../modules/ApiService";
import {Metrics} from "../../Themes";
import {wording} from "../../models/wording";
import locales_es from "./../../locales/es";
import Helpers from "../../modules/Helpers";
import {
	BOOKING_STATUS_CANCELED,
	BOOKING_STATUS_COMPLETED,
	BOOKING_STATUS_CONFIRMED, BOOKING_STATUS_CREATED,
	BOOKING_STATUS_LABELS, BOOKING_STATUS_PENDING, BOOKING_STATUS_REJECTED
} from "../../models/constants";

export default class ProfileAppointmentClose extends Component {

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
			bookingId: this.props.navigation.getParam('bookingId', 0), // TODO DEBUG
			booking: null,
			history: {},
			showImages: false,
			showImagesIndex: 0,
			parsedImages: [],
			vaccines: [],
		};

		this.api = new APIService();
		this.helpers = new Helpers();
	}

	componentWillMount() {
		BackHandler.addEventListener("hardwareBackPress", () => {
			this.props.navigation.goBack();
			return true;
		});
	}

	componentDidMount() {
		this.load();
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
				// this.getLocationData();
				// this.getPetOwnerData();
			})
		}).catch(err => {
			Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
		});
	}

	parseImages() {
		if(this.state.history && this.state.history.images && this.state.history.images.length) {
			let images = JSON.parse(JSON.stringify(this.state.history.images));
			images = images.map(image => {
				image.uri = image.full_image_url;
				return image;
			});
			this.setState({
				parsedImages: images
			});
		}
	}

	parseVaccines() {
		if(this.state.history && this.state.history.vaccines && this.state.history.vaccines.length) {
			let vaccines = JSON.parse(JSON.stringify(this.state.history.vaccines));
			vaccines.map((vaccine, index) => {
				const filter = this.state.petVaccines.filter(petVaccine => petVaccine.id === vaccine.pet_vaccine_id);
				vaccines[index].vaccine_name
				  = filter.length ? filter[0].name : '';
			});
			this.setState({
				vaccines
			});
		}
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

	/*getPetOwnerData() {
		this.api.getUserById(this.state.booking.pet_owner_id).then(res => {
			this.setState({
				petOwner: res.data
			});
		}).catch(err => {
			Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
		});
	}*/

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
							this.api.getClinicHistoriesByBookingId(this.state.bookingId).then(res => {
								console.log(res.data)
								this.setState({
									history: res.data
								}, () => {
									this.api.getPetVaccines(this.state.pet.pet_type_id).then(res => {
										this.setState({
											petVaccines: res.data
										}, () => {
											this.parseVaccines();
										});
									});
									this.parseImages();
								} );
							}).catch(err => {
								Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
							});
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

	showImages(index) {
		this.setState({
			showImages: true,
			showImagesIndex: index
		});
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

						  {booking.date ?
							<View>
								<View style={styles.tandc}>
									<Text style={styles.separatorText}>
										Fecha:
									</Text>
								</View>
								<View style={styles.tandc}>
									<Text style={{color: "#444444"}}>{parseEventDate(booking.date, false, '', true)}</Text>
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
								  Motivo de Consulta:
							  </Text>
						  </View>
						  <View style={styles.tandc}>
							<ScrollView>
							  <Text style={{color: "#444444", textAlign: "center"}}>{this.state.booking.reason}</Text>
							</ScrollView>
						  </View>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Anamnesis:
							  </Text>
						  </View>
						  <View style={styles.tandc}>
							  <ScrollView>
							  	<Text style={{color: "#444444", textAlign: "center"}}>{this.state.history.anamnesis}</Text>
							  </ScrollView>
						  </View>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Examen objetivo general:
							  </Text>
						  </View>
						  <View style={styles.tandc}>
						    <ScrollView>
							  <Text style={{color: "#444444", textAlign: "center"}}>{this.state.history.general_objective_exam}</Text>
							</ScrollView>
						  </View>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Examen objetivo particular:
							  </Text>
						  </View>
						  <View style={styles.tandc}>
						  	<ScrollView>
							  <Text style={{color: "#444444", textAlign: "center"}}>{this.state.history.particular_objective_exam}</Text>
						    </ScrollView>
						  </View>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Diagnóstico:
							  </Text>
						  </View>
						  <View style={styles.tandc}>
						    <ScrollView>
							  <Text style={{color: "#444444", textAlign: "center"}}>{this.state.history.diagnosis}</Text>
							</ScrollView>
						  </View>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Tratamiento Aplicado:
							  </Text>
						  </View>
						  <View style={styles.tandc}>
							  <Text style={{color: "#444444"}}>{this.state.history.applied_treatment}</Text>
						  </View>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Indicaciones:
							  </Text>
						  </View>
						  <View style={styles.tandc}>
						  	<ScrollView>
							  <Text style={{color: "#444444", textAlign: "center"}}>{this.state.history.indications}</Text>
							</ScrollView>
						  </View>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Próximas Visitas:
							  </Text>
						  </View>
						  {this.state.history.controls
						  && this.state.history.controls.length ?
							this.state.history.controls.map(control => {
								return (
								  <View>
									  <View style={styles.tandc}>
										  <Text style={{color: "#444444"}}>{parseEventDate(control.date)}</Text>
									  </View>
									  <View style={styles.tandc}>
										  <Text style={{color: "#444444"}}>{control.reason}</Text>
									  </View>
								  </View>
								)
							})
							:
							<View style={styles.tandc}>
								<Text style={{color: "#444444"}}>Sin controles programados</Text>
							</View>
						  }

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Desparasitación:
							  </Text>
						  </View>
						  <View style={styles.tandc}>
							  {this.state.history.deworming === "1" ?
								<Text style={{color: "#444444"}}>Aplicada</Text>
								:
								<Text style={{color: "#444444"}}>No aplicada</Text>
							  }
						  </View>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Vacunas Aplicadas:
							  </Text>
						  </View>
						  <View style={{height: 10}}/>
						  {this.state.vaccines
						  && this.state.vaccines.length ?
						    this.state.vaccines.map(vaccine => {
							    return (
								  <View>
									  <View style={styles.tandc}>
										  <Text style={{color: "#444444"}}>{vaccine.vaccine_name}</Text>
									  </View>
									  <View style={styles.tandc}>
										  <Text style={{color: "#444444"}}>{vaccine.other_text}</Text>
									  </View>
								  </View>
							    )
						    })
						    :
						    <View style={styles.tandc}>
							    <Text style={{color: "#444444"}}>Sin vacunas aplicadas</Text>
						    </View>
						  }

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Fotos:
							  </Text>
						  </View>
						  {this.state.parsedImages
						  && this.state.parsedImages.length ?
							<Grid style={AppStyles.forms.addRowCard}>
								<Row>
									{this.state.parsedImages.map((image, index) => {
										return (
										  <Col>
											  <TouchableOpacity onPress={() => this.showImages(index)}>
												  <Image style={[styles.profileImage, {
													  borderRadius: 0,
													  zIndex: 1,
												  }]}
												         source={{uri: image.full_image_url}}/>
											  </TouchableOpacity>
										  </Col>
										)
									})
									}
								</Row>
							</Grid>
							:
							<View style={styles.tandc}>
								<Text style={{color: "#444444"}}>Sin fotos.</Text>
							</View>
						  }

						  <View style={{height: 50}}/>
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


			  {this.state.parsedImages
			  && this.state.parsedImages.length ?
			    <ImageView
				  images={this.state.parsedImages}
				  imageIndex={this.state.showImagesIndex}
				  visible={this.state.showImages}
				  onRequestClose={() => this.setState({
					  showImages: false
				  })}
			    />
			    : null
			  }
		  </Container>
		);
	}
}
