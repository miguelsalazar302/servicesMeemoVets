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

import {Col, Row, Grid} from "react-native-easy-grid";

import AppStyles from './../../Themes/ApplicationStyles';

import Ionicons from "react-native-vector-icons/Ionicons";

import DatePicker from 'react-native-date-picker';

import {parseEventDate} from "../../modules/ViewHelpers";


import {
	BOOKING_STATUS_CANCELED,
	BOOKING_STATUS_CONFIRMED, BOOKING_STATUS_PENDING,
	USER_TYPE_PET_OWNER,
	USER_TYPE_VET
} from "../../models/constants";

// IMAGES
import LogoMeemo from './../../assets/images/logomeemoverde.fw.png';
import {EventRegister} from "react-native-event-listeners";
import AuthService from "../../modules/AuthService";
import APIService from "../../modules/ApiService";
import {Metrics} from "../../Themes";
import {wording} from "../../models/wording";
import locales_es from "./../../locales/es";
import Helpers from "../../modules/Helpers";

export default class MyPetOwners extends Component {

	static navigationOptions = {
		header: null,
		headerMode: 'none'
	};

	constructor(props) {
		super(props);

		this.state = {
			pet_owners: null,
		};

		this.api = new APIService();
		this.helpers = new Helpers();
	}


	componentWillMount() {
		BackHandler.addEventListener("hardwareBackPress", function () {
			return true;
		});
	}

	componentDidMount() {
		this.load();
	}

	load() {
		this.api.getMyPetOwners().then(res => {
			this.setState({
				pet_owners: res.data
			});
		}).catch(err => {
			Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
		});
	}

	goToProfilePetOwner(userId){
		this.props.navigation.navigate('ProfilePetOwner', {userId})
	}

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
			  <ScrollView>
				  {this.state.pet_owners === null ? <Spinner/> :
					this.state.pet_owners.length ?
					  <View style={{
						  paddingTop: 20
					  }}>
						  {this.state.pet_owners.map((pet_owner, index) => {
							  return (
								<TouchableOpacity onPress={() => this.goToProfilePetOwner(pet_owner.id)}
								                  style={AppStyles.listCardsRow} key={index}>
									<View style={AppStyles.listCardsRowHeaderView}>
										<Image
										  style={AppStyles.listCardsRowProfileImg}
										  source={{uri: pet_owner.full_profile_image}}
										/>
										<View style={AppStyles.listCardsRowHeaderNameView}>
											<Text
											  style={AppStyles.listCardsRowNameTxt}>{pet_owner.lastname} {pet_owner.name}</Text>
											<Text
											  style={AppStyles.listCardsRowNameTxt}>{pet_owner.email}</Text>
										</View>
									</View>
									<View style={AppStyles.listCardsRowDividerHorizontal}/>
								</TouchableOpacity>
							  )
						  })}
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
									  No has atendido a ningún paciente.
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
