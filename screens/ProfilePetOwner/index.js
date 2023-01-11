import React, {Component} from 'react';
import {
	Text,
	Image,
	StatusBar,
	Platform,
	ImageBackground,
	Dimensions,
	TouchableOpacity,
	View,
	BackHandler,
	I18nManager, Alert
} from 'react-native';
import {Container, Right, Left, Content, Body, Header, Spinner, Icon} from 'native-base';
// Screen Styles
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Images} from '../../Themes/';

import APIService from "../../modules/ApiService";
import locales_es from "../../locales/es";
import Loading from "../../components/loading";


/**
 *  Profile Screen
 */
export default class ProfilePetOwner extends Component {

	static navigationOptions = {
		header: null,
		headerMode: 'none'
	};

	componentWillMount() {
		const that = this;
		BackHandler.addEventListener('hardwareBackPress', function () {
			that.props.navigation.navigate('Profile');
			return true;
		});
	}

	constructor(props) {
		super(props);
		this.state = {
			userId: this.props.navigation.getParam('userId', 0),
			user: null,
			loading: false,
			pets: null,
			pet_genders: [],
			pet_types: [],
		};

		this.api = new APIService();
	}

	componentDidMount() {
		this.api.getUserById(this.state.userId).then(res => {
			this.setState({
				user: res.data
			});
		}).catch(err => {
			console.log(err);
		});

		this.api.getPetTypes().then(res => {
			this.setState({
				pet_types: res.data
			}, () => {
				this.api.getPetGenders().then(res => {
					this.setState({
						pet_genders: res.data
					}, () => {
						this.api.getPetsByOwnerId(this.state.userId).then(res => {
							this.setState({
								pets: res.data
							});
						}).catch(err => {
							console.log(err);
						});
					});
				});

			});
		}).catch(err => {
			Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
		});
	}

	getPetGender(id) {
		const result = this.state.pet_genders.filter(item => Number(item.id) === Number(id));
		return result.length ? result[0].name : '';
	}

	getPetType(id) {
		const result = this.state.pet_types.filter(item => Number(item.id) === Number(id));
		return result.length ? result[0].name : '';
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

	goToPetProfile(petId) {
		this.props.navigation.navigate('ProfilePet', {petId})
	}

	render() {
		StatusBar.setBarStyle('light-content', true);
		if (Platform.OS === 'android') {
			StatusBar.setBackgroundColor('transparent', true);
			StatusBar.setTranslucent(true);
		}

		const that = this;

		return (
		  !this.state.user ?
			<Container style={styles.main}>
				<View style={{flexDirection: 'column'}}>

					<Header style={styles.header}>
						<Left style={styles.left}>
							<TouchableOpacity style={styles.backArrow}
							                  onPress={() => that.props.navigation.goBack()}>
								<FontAwesome name={I18nManager.isRTL ? "angle-right" : "angle-left"} size={25}
								             color='white'/>
							</TouchableOpacity>
						</Left>
						<Body style={styles.body}>
						<Text style={styles.textTitle}>Perfil del dueño</Text>
						</Body>
						<Right style={styles.right}>
						</Right>
					</Header>
					<Spinner/>
				</View>
			</Container> :
			<Container style={styles.main}>
				{this.state.loading ?
				  <Loading/>
				  : null}
				<View style={{flexDirection: 'column'}}>

					<Header style={styles.header}>
						<Left style={styles.left}>
							<TouchableOpacity style={styles.backArrow}
							                  onPress={() => that.props.navigation.goBack()}>
								<FontAwesome name={I18nManager.isRTL ? "angle-right" : "angle-left"} size={25}
								             color='white'/>
							</TouchableOpacity>
						</Left>
						<Body style={styles.body}>
						<Text style={styles.textTitle}>Perfil del Dueño</Text>
						</Body>
						<Right style={styles.right}>
							<TouchableOpacity onPress={() => alert("Setting")}>
								<Image source={Images.setting} style={styles.settingIcon}/>
							</TouchableOpacity>
						</Right>
					</Header>

					<View style={styles.profileView}>
						{this.state.user && this.state.user.full_profile_image ?
						  <Image style={styles.profileImg} source={{uri: this.state.user.full_profile_image}}/>
						  : null}
						<Text style={styles.nameTxt}>{this.state.user.name} {this.state.user.lastname}</Text>
						<Text style={styles.designtaionTxt}>Dueño</Text>
					</View>
					<View style={styles.backBottomView}/>
				</View>

				<Content style={styles.contentView}>
					<View style={styles.overlayContentBg}>

						<View style={styles.cardBg}>
							<Text style={styles.aboutLabelTxt}>E-MAIL</Text>
							<Text style={styles.aboutDescriptionTxt}>
								{this.state.user.email}
							</Text>
							{this.state.user.phone ?
							  <View>
								  <Text style={styles.aboutLabelTxt}>TELÉFONO</Text>
								  <Text style={styles.aboutDescriptionTxt}>
									  {this.state.user.phone}
								  </Text>
							  </View>
							  : null}
						</View>
						{this.state.pets === null ? <Spinner/> :
						  this.state.pets.length ?
							this.state.pets.map(pet => {
								return (
								  <View style={styles.cardBg}>
									  <TouchableOpacity onPress={() => this.goToPetProfile(pet.id)}>
										  <View style={[styles.rowBg, {backgroundColor: 'transparent'}]}>
											  <View style={styles.rowHeaderView}>
												  <Image
													style={styles.profileImgList}
													source={{uri: pet.full_profile_image}}
												  />
												  <View style={styles.rowHeaderNameView}>
													  <Text style={styles.rowNameTxt}>{pet.name}</Text>
													  <Text
														style={styles.rowTimeTxt}>{this.getPetType(pet.pet_type_id)}</Text>
													  <Text
														style={styles.rowTimeTxt}>{this.getPetGender(pet.pet_gender_id)}</Text>
												  </View>
												  <Icon style={{
													  position: 'absolute',
													  right: 5,
													  justifyContent: 'center',
													  alignSelf: 'center'
												  }} name="ios-arrow-forward"/>
											  </View>
										  </View>
									  </TouchableOpacity>
								  </View>
								)
							})
							:
							<View style={styles.cardBg}>
								<Text style={styles.aboutLabelTxt}>No se encontraron mascotas disponibles</Text>
							</View>
						}
					</View>
				</Content>

			</Container>
		);
	}
}
