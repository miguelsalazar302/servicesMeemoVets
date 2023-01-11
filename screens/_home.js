// No es el original. Está tocado por Woopi.
// Si se necesita el original, revisar en el template.
import React, {Component} from "react";
import {Metrics} from "../Themes"
import {
	Text,
	//ListView,
	View,
	Image,
	StatusBar,
	TouchableOpacity,
	Platform,
	ImageBackground,
	BackHandler,
	I18nManager,
	TextInput,
	AsyncStorage, Alert
} from "react-native";
import {
	Container,
	Content,
	Button,
	Icon,
	Right,
	Item,
	Input,
	Header,
	Left,
	Body,
	Title,
	Spinner,
} from "native-base";
import RNRestart from 'react-native-restart'
import Swiper from "react-native-swiper";
import DatePicker from 'react-native-date-picker';
// import { CachedImage } from "react-native-cached-image";
import {Col, Row, Grid} from "react-native-easy-grid";

// IMAGES
import LogoMeemo from './../assets/images/logomeemoverde.fw.png';
import HomeDemo from './../assets/images/home-demo.jpg';

import Ionicons from "react-native-vector-icons/Ionicons";

import moment from "moment/moment";

import AppStyles from './../Themes/ApplicationStyles';

// Screen Styles
import styles from "./../containers/ECommerce/Menu/styles";
import APIService from "../modules/ApiService";
import AuthService from "../modules/AuthService";
import {wording} from "../models/wording";
import {BOOKING_STATUS_CANCELED, BOOKING_STATUS_COMPLETED, BOOKING_STATUS_CONFIRMED, BOOKING_STATUS_PENDING, BOOKING_STATUS_REJECTED, USER_TYPE_VET} from "../models/constants";
import {parseEventDate} from "../modules/ViewHelpers";
import {EventRegister} from "react-native-event-listeners";

/**
 *  Profile Screen
 */

const confirmedDataTabKey = 'confirmedData';

const timezone = -(new Date().getTimezoneOffset());

export default class _home extends Component {
	static navigationOptions = {
		header: null,
		headerMode: 'none'
	};

	constructor(props) {
		super(props);

		this.state = {
			// dataSource: ds.cloneWithRows(dataObjects),
			slider: [],
			nextBooking: null,
			pendingBookings: [],
			confirmBookingDate: null,
			uniqueValue: 0,
		};

		this.api = new APIService();
		this.auth = new AuthService();
	}

	componentWillMount() {
		BackHandler.addEventListener("hardwareBackPress", () => this.backPressed);
		this.listener = EventRegister.addEventListener('reloadBookings', (data) => {
			this.loadBookings();
		})
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.listener);
		BackHandler.removeEventListener("hardwareBackPress", () => this.backPressed);
	}

	componentDidMount() {
		this.api.getVetSlider().then(res => {
			this.setState({
				slider: res.data
			})
		}).catch(err => {
			console.log(err);
		});

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

		this.api.getMPExpireDate().then(res => {
			this.tDate(res.data[0].expire_at)
		});

		this.loadBookings();
		this.loadPendingBookings();
	}

	tDate(current) {
		var Today = new Date();
	
		if (new Date(current).getTime() <= Today.getTime()) {
				Alert.alert(
					"Cuenta de cobros",
					`La vinculación con tu cuenta de MercadoPago EXPIRÓ el ${current} y debe volver a vincularse si quieres cobrar.`,
				[
				  { text: "Renovar", onPress: () => this.props.navigation.navigate("Wallet") }
				],
				{ cancelable: false }
			  );
			  Alert.alert("Cuenta de cobros", `La vinculación con tu cuenta de MercadoPago EXPIRÓ el ${current} y debe volver a vincularse si quieres cobrar.`);
			  return false;
		 }
		return true;
	}

	loadPendingBookings() {
		this.api.getMyBookingsByStatus(BOOKING_STATUS_PENDING).then(res => {
			this.setState({
				pendingBookings: res.data
			});
		}).catch(err => {
			console.log(err);
		});
	};

	loadBookings() {
		this.api.getMyBookingsByStatus(BOOKING_STATUS_CONFIRMED).then(res => {
			this.setState({
				nextBooking: res.data
			});
		}).catch(err => {
			console.log(err);
		});
	};

	backPressed = () => {
		// alert('back');
		//this.props.navigation.navigate("FirstScreen");
		return true;
	};

	_handleProductDetailClick() {
		this.props.navigation.navigate("ECommerceProductDetails", {
			screenName: "ECommerceMenu"
		});
	}

	_handleProductPage() {
		// AsyncStorage.multiSet([["ArrivedFrom", "ECommerceMain"]]);
		this.props.navigation.navigate("ECommerceCategoryProduct");

		// this.props.navigation.navigate("ECommerceCategoryProduct",{},
		// {
		//   type: "Navigation/NAVIGATE",
		//   routeName: "ECommerceCategoryProduct",
		//   params: {name: "ECommerceMenu"}
		// })
	}

	_renderRow(rowData) {
		return (
		  <TouchableOpacity onPress={() => this._handleProductPage()}>
			  <ImageBackground
				source={rowData.coverImage}
				style={styles.coverImageStyle}
			  >
				  <View
					style={[styles.categoryBtn, {backgroundColor: rowData.color}]}
				  >
					  <Text style={styles.buttonText}>{rowData.category}</Text>
				  </View>
			  </ImageBackground>
		  </TouchableOpacity>
		);
	}

	goToChat(bookingId) {
		this.props.navigation.navigate('Chat', {bookingId});
	}

	goToProfileBooking(bookingId) {
		this.props.navigation.navigate('ProfileBooking', {bookingId});
	}

	confirmCancelBooking(bookingId) {
		Alert.alert(
		  '¿Cancelar servicio?',
		  '¿Está seguro de querer cancelar este servicio?',
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
		this.api.putBooking(obj).then(res => {
			RNRestart.Restart();
		}).catch(err => {
			console.log(err);
			const errorMsg = err.response && err.response.data && err.response.data.message
			  ? err.response.data.message : err.message;
			Alert.alert(wording.global.errorTitle, errorMsg);
		})
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

	openDatePicker() {
		this.setState({
			showDatePicker: true,
		});
	}

	closeDatePicker() {
		this.setState({
			showDatePicker: false,
		});
	}

	setConfirmBookingDate(date) {
		this.setState({
			confirmBookingDate: date
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

	confirmBooking() {
		const obj = {
			id: this.state.confirmBookingId,
			status: BOOKING_STATUS_CONFIRMED,
			date: this.state.confirmBookingDate.toISOString()
		};
		this.showLoading();
		this.closeDatePicker();
		this.api.putBooking(obj).then(res => {
			this.hideLoading();
			Alert.alert(wording.global.successTitle, res.message);
			this.loadBookings();
			RNRestart.Restart();
		}).catch(err => {
			console.log(err);
			const errorMsg = err.response && err.response.data && err.response.data.message
			  ? err.response.data.message : err.message;
			Alert.alert(wording.global.errorTitle, errorMsg);
			this.hideLoading();
		})
	}
	forceRemount = () => {
		this.setState(({ uniqueValue }) => ({
		  uniqueValue: uniqueValue + 1
		}))
	}

	render() {
		StatusBar.setBarStyle("light-content", true);
		if (Platform.OS === "android") {
			StatusBar.setBackgroundColor("#0e1130", true);
			StatusBar.setTranslucent(true);
		}
		StatusBar.setHidden(true);

		return (			
		  <Container key={this.state.uniqueValue}>
			  
			  <Header style={styles.header} androidStatusBarColor={"#0e1130"}>
				  <Left style={styles.left}>
					  <TouchableOpacity
						style={styles.backArrow}
						onPress={() => this.props.openDrawer()}
					  >
						  <Icon name="ios-menu" style={styles.iconColor}/>
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
				<View style={{width: Metrics.WIDTH, height: Metrics.HEIGHT * 0.9}}>
					<Container style={AppStyles.datePickerFullScreenContainer}>
						<Header style={{backgroundColor: '#fff'}} noShadow={true}>
							<Right>
								<TouchableOpacity onPress={() => this.closeDatePicker()}>
									<Ionicons name="ios-close" size={50} color="#d4d4d4"/>
								</TouchableOpacity>
							</Right>
						</Header>
						<Header style={{backgroundColor: '#fff'}} noShadow={true}>
							<Body style={{flex:1, alignItems: "center"}}>
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
			  <Content>
				  <View style={styles.slidesec}>
					  {this.state.slider.length ?
						<Swiper
						  showsButtons={false}
						  autoplay={true}
						  autoplayTimeout={4}
						  activeDot={<View style={styles.activeDot}/>}
						  dot={<View style={styles.dot}/>}
						>
							{this.state.slider.map((item, index) => {
								return (
								  <View style={styles.slide} key={index}>
									  <Image source={{uri: item.full_image}} style={styles.sliderImage}/>
									  {/*<View style={styles.contentStyle}>
                                                <Text style={styles.headertext}>{item.title}</Text>
                                                <Text style={styles.desctext}>{item.description}</Text>
                                            </View>*/}
								  </View>
								);
							})}
						</Swiper>
						: null}
				  </View>

				  {this.state.views_in_results && this.state.views_profile ?
					<View>
						<View style={styles.newArrivalSec}>
							<Left style={styles.sideButtons}>
								{/*<MaterialCommunityIcons
                                name="chevron-left"
                                size={26}
                                color="#cccccc"
                                onPress={() => this.refs.swiper.scrollBy(-1)}
                            />*/}
							</Left>
							<Body style={styles.newArrivalBody}>
							<Text style={styles.titelText}>Estadísticas</Text>
							</Body>
							<Right style={styles.sideButtons}>
								{/*<MaterialCommunityIcons
                                name="chevron-right"
                                size={26}
                                color="#cccccc"
                                onPress={() => this.refs.swiper.scrollBy(1)}
                            />*/}
							</Right>
						</View>

						<Grid style={styles.newArrivalSec}>
							<Row>
								<Col style={AppStyles.justifyContentCenter}>
									<Text
									  style={[AppStyles.textAlignCenter, AppStyles.textBig, AppStyles.textGrey]}>{this.state.views_in_results}</Text>
									<Text style={[AppStyles.textAlignCenter, AppStyles.textGrey]}>veces que apareciste
										en {'\n'}resultados de búsqueda</Text>
								</Col>
								<Col style={AppStyles.justifyContentCenter}>
									<Text
									  style={[AppStyles.textAlignCenter, AppStyles.textBig, AppStyles.textGrey]}>{this.state.views_profile}</Text>
									<Text style={[AppStyles.textAlignCenter, AppStyles.textGrey]}>veces que {'\n'}vieron tu
										perfil</Text>
								</Col>
							</Row>
						</Grid>
					</View>
					: null
				  }

				  <View style={styles.newArrivalSec}>
					  <Body style={styles.newArrivalBody}>
					  <Text style={styles.titelText}>Próximos Servicios</Text>
					  </Body>
				  </View>

				  {this.state.nextBooking === null ? <Spinner/> :
					this.state.nextBooking && this.state.nextBooking.length ?
					  this.state.nextBooking.map((item, index) => {
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
										<Text
										  style={AppStyles.listCardsRowTimeTxt}>{parseEventDate(item.date, false, '', true)}</Text>
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
										</Row>
									</Grid>
								</View>
							</TouchableOpacity>
						  );
					  })
					  :
					  <Grid style={styles.newArrivalSec}>
						  <Row>
							  <Col style={AppStyles.justifyContentCenter}>
								  <Text style={[AppStyles.textAlignCenter, AppStyles.textGrey]}>No tienes consultas
									  próximamente.</Text>
							  </Col>
						  </Row>
					  </Grid>
				  }

				  {/*<Swiper
                        style={styles.swiperView}
                        ref="swiper"
                        loop={false}
                        showsButtons={false}
                        autoplayTimeout={2.5}
                        activeDot={<View />}
                        dot={<View />}
                    >
                        {new_arrival.map((item, index) => {
                            return (
                                <View key={index} style={styles.newArrivalView}>
                                    {item.products.map((item, index) => {
                                        return (
                                            <View key={index}>
                                                <TouchableOpacity
                                                    style={styles.rowMain}
                                                    onPress={() => this._handleProductDetailClick()}
                                                >
                                                    <CachedImage
                                                        source={item.itemImage}
                                                        style={styles.itemImage}
                                                    />
                                                    <Image source={item.itemImage} style={styles.itemImage} />
                                                    <Text style={styles.itemTitle} numberOfLines={2}>
                                                        {item.itemTitle}
                                                    </Text>
                                                    <Text style={styles.itemPrice}>{item.itemPrice}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    })}
                                </View>
                            );
                        })}
                    </Swiper>*/}
			  </Content>}
		  </Container>
		);
	}
}
