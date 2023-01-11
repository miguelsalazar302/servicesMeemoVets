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
	AsyncStorage, Alert
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
import moment from "moment/moment";

import {Col, Row, Grid} from "react-native-easy-grid";

import AppStyles from './../../Themes/ApplicationStyles';

import Ionicons from "react-native-vector-icons/Ionicons";

import DatePicker from 'react-native-date-picker';

import {parseEventDate} from "../../modules/ViewHelpers";


import {
	BOOKING_STATUS_CANCELED,
	BOOKING_STATUS_CONFIRMED, BOOKING_STATUS_PENDING, BOOKING_STATUS_REJECTED,
	USER_TYPE_VET
} from "../../models/constants";

// IMAGES
import LogoMeemo from './../../assets/images/logomeemoverde.fw.png';
import {EventRegister} from "react-native-event-listeners";
import APIService from "../../modules/ApiService";
import AuthService from "../../modules/AuthService";
import {wording} from "../../models/wording";

const timezone = -(new Date().getTimezoneOffset());

const confirmedDataTabKey = 'confirmedData';
const pendingDataTabKey = 'pendingData';

export default class MyAppointments extends Component {

	static navigationOptions = {
		header: null,
		headerMode: 'none'
	};

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			segment: 1,
			pendingData: [],
			confirmedData: null,
			showDatePicker: false,
			datePickerLinkText: 'Cerrar',
			confirmBookingId: 0,
			confirmBookingDate: new Date(),
		};

		this.api = new APIService();
		this.auth = new AuthService();

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

	closeDatePicker() {
		this.setState({
			showDatePicker: false,
		});
	}

	openDatePicker() {
		this.setState({
			showDatePicker: true,
		});
	}

	componentWillMount() {
		BackHandler.addEventListener("hardwareBackPress", function () {
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

	load() {
		this.showLoading();
		// const query = this.state.segment === 1 ? BOOKING_STATUS_PENDING : BOOKING_STATUS_CONFIRMED;
		this.getBookingsFromAPI(BOOKING_STATUS_PENDING, pendingDataTabKey, this.hideLoading);
		this.getBookingsFromAPI(BOOKING_STATUS_CONFIRMED, confirmedDataTabKey, this.hideLoading);
	}

	getBookingsFromAPI(status, target, callback) {
		this.api.getMyBookingsByStatus(status).then(res => {
			this.hideLoading();

			const obj = {};
			obj[target] = [];

			this.setState(obj, () => {
				obj[target] = res.data;
				this.setState(obj, callback);
			});
		}).catch(err => {
			console.log(err);
			const errorMsg = err.response && err.response.data && err.response.data.message
			  ? err.response.data.message : err.message;
			Alert.alert(wording.global.errorTitle, errorMsg);
		});
	}

	confirmCancelBooking(bookingId) {
		Alert.alert(
		  '¿Cancelar servicio?',
		  'La cancelación de la consulta implica la devolución total del importe cobrado al cliente en caso que se haya cobrado de forma anticipada.',
		  [
			  {
				  text: 'Sí, cancelar servicio.',
				  onPress: () => {
					  this.cancelBooking(bookingId)
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

	cancelBooking(bookingId) {
		const obj = {
			id: bookingId,
			status: BOOKING_STATUS_REJECTED
		};
		this.showLoading();
		this.api.putBooking(obj).then(res => {
			this.load();
			this.hideLoading();
		}).catch(err => {
			console.log(err);
			const errorMsg = err.response && err.response.data && err.response.data.message
			  ? err.response.data.message : err.message;
			Alert.alert(wording.global.errorTitle, errorMsg);
			this.hideLoading();
		})
	}

	loadCreatedBookings() {
		if(this.state.loading) {
			return;
		}
		this.showLoading();
		this.setState({segment: 1});
		this.getBookingsFromAPI(BOOKING_STATUS_PENDING, pendingDataTabKey, this.hideLoading);
	}

	loadConfirmedBookings() {
		if(this.state.loading) {
			return;
		}
		this.showLoading();
		this.setState({segment: 2});
		this.getBookingsFromAPI(BOOKING_STATUS_CONFIRMED, confirmedDataTabKey, this.hideLoading);
	}

	goToCloseConsultation(booking_id, pet_id) {
		this.props.navigation.navigate('AppointmentClose', {
			booking_id,
			pet_id
		});
	}

	confirmConfirmBooking(bookingId, suggestedDate) {
		this.setState({
			confirmBookingId: bookingId,
			confirmBookingDate: new Date(moment(suggestedDate)),

		}, () => this.openDatePicker());
	}

	confirmBooking() {
		const obj = {
			id: this.state.confirmBookingId,
			status: BOOKING_STATUS_CONFIRMED,
			date: this.state.confirmBookingDate.toISOString()
		};
		this.showLoading();
		this.closeDatePicker();
		this.api.putBooking(obj).then(res => {
			this.load();
			this.hideLoading();
			Alert.alert(wording.global.successTitle, res.message);
			this.loadConfirmedBookings();
		}).catch(err => {
			console.log(err);
			const errorMsg = err.response && err.response.data && err.response.data.message
			  ? err.response.data.message : err.message;
			Alert.alert(wording.global.errorTitle, errorMsg);
			this.hideLoading();
		})
	}

	goToHome() {
		EventRegister.emit('loadSection', 'showHome');
		this.props.navigation.navigate('Home');
	}

	goToChat(bookingId) {
		this.props.navigation.navigate('Chat', {bookingId});
	}

	setConfirmBookingDate(date) {
		this.setState({
			confirmBookingDate: date
		});
	}

	goToProfileBooking(bookingId) {
		this.props.navigation.navigate('ProfileBooking', {bookingId});
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

	_renderActiveComponent = () => {
		const {segment} = this.state;

		// Details
		if (segment === 1) {
			return (
			  <Content>
				  <View
					style={AppStyles.mainListCardsRowView}
					animation="zoomIn"
					duration={1100}
					delay={700}
				  >
					  {this.state.pendingData.length ? this.state.pendingData.map((item, index) => {
							return (
							  <TouchableOpacity
							    onPress={() => this.goToProfileBooking(item.id)}
								style={AppStyles.listCardsRow} key={index}>
								  <View style={AppStyles.listCardsRowHeaderView}>
									  <Image
										style={AppStyles.listCardsRowProfileImg}
										source={{uri: item.pet_owner_full_profile_image}}
									  />
									  <View style={AppStyles.listCardsRowHeaderNameView}>
										  <Text
											style={AppStyles.listCardsRowNameTxt}>{item.pet_owner_name} {item.pet_owner_lastname}</Text>
										  <Text style={AppStyles.listCardsRowTimeTxt}>{parseEventDate(item.suggested_date, false, '', true)}</Text>
									  </View>
									  <Right style={AppStyles.listCardsRowMoreIcon}>
										  <TouchableOpacity onPress={() => this.goToChat(item.id)}>
											  <Ionicons name="ios-chatboxes" size={25} color="#d4d4d4"/>
										  </TouchableOpacity>
									  </Right>
								  </View>
								  <View style={AppStyles.listCardsRowDividerHorizontal}/>

								  <View style={AppStyles.listCardsRowHeaderView}>
									  <Image
									    style={AppStyles.listCardsRowProfileImg}
									    source={{uri: item.pet_full_profile_image}}
									  />
									  <View style={AppStyles.listCardsRowHeaderNameView}>
										  <Text
										    style={AppStyles.listCardsRowNameTxt}>{item.pet_name}</Text>
										  <Text style={AppStyles.listCardsRowTimeTxt}>{item.pet_type_name}</Text>
									  </View>
								  </View>
								  <View style={AppStyles.listCardsRowDividerHorizontal}/>

								  <View style={AppStyles.listCardsRowDescriptionView}>
									  <Text style={AppStyles.listCardsRowDescTxt}>{item.reason}</Text>
								  </View>
								  <View style={AppStyles.dividerHorizontal}/>
								  <View style={AppStyles.listCardsRowLikeCommentShareView}>
									  <Grid>
										  <Row>
											  <Col>
												  <TouchableOpacity onPress={() => this.confirmCancelBooking(item.id)}>
													  <Text style={AppStyles.listCardsRowButton}>Rechazar</Text>
												  </TouchableOpacity>
											  </Col>
											  {item.status === BOOKING_STATUS_PENDING ?
												<Col>
													<TouchableOpacity onPress={() => this.confirmConfirmBooking(item.id, item.suggested_date)}>
														<Text style={AppStyles.listCardsRowButton}>Confirmar</Text>
													</TouchableOpacity>
												</Col>
												: null
											  }
											  <Col>
												  <TouchableOpacity onPress={() => this.goToChat(item.id)}>
													  <Text style={AppStyles.listCardsRowButton}>Mensajes</Text>
												  </TouchableOpacity>
											  </Col>
										  </Row>
									  </Grid>
								  </View>
							  </TouchableOpacity>
							);
						})
						:
						<View style={AppStyles.listCardsRow}>
							<View style={AppStyles.listCardsRowDescriptionView}>
								<Text style={AppStyles.listCardsRowDescTxt}>No tienes solicitudes pendientes</Text>
							</View>
							<View style={{height: 10}}/>
						</View>
					  }
				  </View>
			  </Content>
			);
		}

		// Reviews
		if (segment === 2) {
			return (
			  <Content>
				  <View
					style={AppStyles.mainListCardsRowView}
					animation="zoomIn"
					duration={1100}
					delay={700}
				  >
					  {this.state.confirmedData ? this.state.confirmedData.length ? this.state.confirmedData.map((item, index) => {
							return (
							  <TouchableOpacity
							    onPress={() => this.goToProfileBooking(item.id)}
							    style={AppStyles.listCardsRow} key={index}>
								  <View style={AppStyles.listCardsRowHeaderView}>
									  <Image
										style={AppStyles.listCardsRowProfileImg}
										source={{uri: item.pet_owner_full_profile_image}}
									  />
									  <View style={AppStyles.listCardsRowHeaderNameView}>
										  <Text
											style={AppStyles.listCardsRowNameTxt}>{item.pet_owner_name} {item.pet_owner_lastname}</Text>
										  <Text style={AppStyles.listCardsRowTimeTxt}>{parseEventDate(item.date, false, '', true)}</Text>
									  </View>
									  <Right style={AppStyles.listCardsRowMoreIcon}>
										  <TouchableOpacity onPress={() => this.goToChat(item.id)}>
											  <Ionicons name="ios-chatboxes" size={25} color="#d4d4d4"/>
										  </TouchableOpacity>
									  </Right>
								  </View>
								  <View style={AppStyles.listCardsRowDividerHorizontal}/>


								  <View style={AppStyles.listCardsRowHeaderView}>
									  <Image
									    style={AppStyles.listCardsRowProfileImg}
									    source={{uri: item.pet_full_profile_image}}
									  />
									  <View style={AppStyles.listCardsRowHeaderNameView}>
										  <Text
										    style={AppStyles.listCardsRowNameTxt}>{item.pet_name}</Text>
										  <Text style={AppStyles.listCardsRowTimeTxt}>{item.pet_type_name}</Text>
									  </View>
								  </View>
								  <View style={AppStyles.listCardsRowDividerHorizontal}/>


								  <View style={AppStyles.listCardsRowDescriptionView}>
									  <Text style={AppStyles.listCardsRowDescTxt}>{item.reason}</Text>
								  </View>
								  <View style={AppStyles.dividerHorizontal}/>
								  <View style={AppStyles.listCardsRowLikeCommentShareView}>
									  <Grid>
										  <Row>
											  <Col>
											    <TouchableOpacity
												  onPress={() => this.state.userType == USER_TYPE_VET ? this.goToCloseConsultation(item.id, item.pet_id) : this.finishBooking(item.id)}>
												    <Text style={AppStyles.listCardsRowButton}>{this.state.userType == USER_TYPE_VET ? "Completar HC" : "Marcar Finalizado"}</Text>
												</TouchableOpacity>
											  </Col>
											  <Col>
												  <TouchableOpacity onPress={() => this.confirmCancelBooking(item.id)}>
													  <Text style={AppStyles.listCardsRowButton}>Cancelar</Text>
												  </TouchableOpacity>
											  </Col>
											  <Col>
												  <TouchableOpacity onPress={() => this.goToChat(item.id)}>
													  <Text style={AppStyles.listCardsRowButton}>Mensajes</Text>
												  </TouchableOpacity>
											  </Col>
										  </Row>
									  </Grid>
								  </View>
							  </TouchableOpacity>
							);
						})
						:
						<View style={AppStyles.listCardsRow}>
							<View style={AppStyles.listCardsRowDescriptionView}>
								<Text style={AppStyles.listCardsRowDescTxt}>No tienes solicitudes confirmadas</Text>
							</View>
							<View style={{height: 10}}/>
						</View>
						:
						<View style={AppStyles.listCardsRow}>
							<View style={AppStyles.listCardsRowDescriptionView}>
								<Text style={AppStyles.listCardsRowDescTxt}><Spinner/></Text>
							</View>
							<View style={{height: 10}}/>
						</View>
					  }
				  </View>
			  </Content>
			);
		}
	};

	render() {

		StatusBar.setBarStyle("light-content", true);

		if (Platform.OS === "android") {
			StatusBar.setBackgroundColor("#0e1130", true);
			StatusBar.setTranslucent(true);
		}

		return (
		  <Container>
			  <Header style={styles.header} androidStatusBarColor={"#0e1130"}>
				  <Left style={styles.left}>
					  <TouchableOpacity
						style={styles.backArrow}
						onPress={() => this.props.openDrawer ? this.props.openDrawer() : this.goToHome()}
					  >
						  <Icon name="ios-menu" style={styles.iconColor} />
					  </TouchableOpacity>
				  </Left>

				  <Body style={styles.body}>
				  <Image
					source={LogoMeemo}
					style={{flex: 0.3, resizeMode: "contain"}}
				  />
				  </Body>

				  <Right style={styles.right}/>
			  </Header>
			  {this.state.showDatePicker ?
				<View style={styles.content}>
					<Container style={AppStyles.datePickerFullScreenContainer}>
						<Header style={{backgroundColor: '#fff'}} noShadow={true}>
							<Right>
								<TouchableOpacity onPress={() => this.closeDatePicker()}>
									<Ionicons name="ios-close" size={50} color="#d4d4d4"/>
								</TouchableOpacity>
							</Right>
						</Header>
						<Header style={{backgroundColor: '#fff'}} noShadow={true}>
							<Body style={styles.body}>
							<Text>¿En qué día y hora harás la visita?</Text>
							</Body>
						</Header>
						<DatePicker
						  style={AppStyles.datePicker}
						  fadeToColor={'#ccc'}
						  date={this.state.confirmBookingDate}
						  mode="datetime"
						  locale="es-ES"
						  minimumDate={new Date()}
						  minuteInterval={15}
						  is24Hour={true}
						  timeZoneOffsetInMinutes={timezone}
						  hideText={true}
						  onDateChange={date => this.setConfirmBookingDate(date)}
						/>
						<TouchableOpacity onPress={() => this.confirmBooking()}>
							<Text style={AppStyles.datePickerLink}>Confirmar</Text>
						</TouchableOpacity>
					</Container>
				</View>
				:
				<View style={styles.content}>
					<Segment style={styles.segmentTabSec}>
						<Button
						  first
						  style={
							  this.state.segment === 1
								? [
									styles.segmentSelectedTab,
									{borderTopLeftRadius: 5, borderBottomLeftRadius: 5}
								]
								: styles.segmentTab
						  }
						  active={this.state.segment === 1}
						  onPress={() => this.loadCreatedBookings()}
						>
							<Text
							  style={
								  this.state.segment === 1
									? styles.activeTab
									: styles.normalTab
							  }
							>
								Pendientes
							</Text>
						</Button>

						<Button
						  last
						  style={
							  this.state.segment === 1
								? styles.segmentTab
								: [
									styles.segmentSelectedTab,
									{borderTopRightRadius: 5, borderBottomRightRadius: 5}
								]
						  }
						  active={this.state.segment === 2}
						  onPress={() => this.loadConfirmedBookings()}
						>
							<Text
							  style={
								  this.state.segment === 2
									? styles.activeTab
									: styles.normalTab
							  }
							>
								Confirmados
							</Text>
						</Button>
					</Segment>
					{this.state.loading ? <Spinner/> :
					  this._renderActiveComponent()
					}
				</View>
			  }
		  </Container>
		);
	}
}
