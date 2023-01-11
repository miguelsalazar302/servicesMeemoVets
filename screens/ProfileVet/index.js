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
	I18nManager,
	ScrollView,
} from 'react-native';
import {Container, Right, Left, Content, Body, Header, Spinner} from 'native-base';
// Screen Styles
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Images} from '../../Themes/';

import ApplicationStyles from './../../Themes/ApplicationStyles';
import {USER_TYPE_VET} from "../../models/constants";
import APIService from "../../modules/ApiService";
import AuthService from "../../modules/AuthService";
import {Metrics} from "../../Themes";


/**
 *  Profile Screen
 */
export default class ProfileVet extends Component {

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
			registration_purpose: ''
		};

		this.api = new APIService();
		this.auth = new AuthService();
	}

	componentDidMount() {
		this.api.getVetByUserId(this.state.userId).then(res => {
			this.setState({
				user: res.data
			}, () => {
				this.getRegistrationPurpose();
				this.auth.getLocalUserData().then(res => {
					this.setState({
						me: res
					});
				})
			});

		}).catch(err => {
			console.log(err);
		});

	}

	getRegistrationPurpose() {
		this.api.getRegistrationsPurposes().then(res => {
			const purposes = res.data;
			this.setState({
				registration_purpose: purposes.filter(p => p.id == this.state.user.registrations_purposes_id)[0].name
			})
		}).catch(err => {
			console.log(err);
		});
	}

	goToBookVetService() {
		this.props.navigation.navigate('BookVetService');
	}

	goToEditProfileVet() {
		this.props.navigation.navigate('EditProfileVet', {userId: this.state.userId});
	}

	renderSpecialties() {
		let text = '';
		const length = this.state.user.specialties.length;
		this.state.user.specialties.map((specialty, index) => {
			text += specialty.name;
			if ((index + 1) < length) {
				text += ' - ';
			}
		});
		return text;
	}

	renderProfessionalsRegistrations() {
		return this.state.user.professionals_registrations
		  .map(pro_reg => <Text key={'pro_reg_' + pro_reg.id} style={styles.aboutDescriptionTxt}>
			  {pro_reg.registration_number} - {pro_reg.name}
		  </Text>);
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
						<Text style={styles.textTitle}>Perfil del Veterinario</Text>
						</Body>
						<Right style={styles.right}>
						</Right>
					</Header>
					<Spinner/>
				</View>
			</Container> :
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
						<Text style={styles.textTitle}>Perfil del Veterinario</Text>
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
						<Text style={styles.designtaionTxt}>Veterinario</Text>
					</View>
					<View style={styles.backBottomView}/>
				</View>

				<Content style={styles.contentView}>
					<ScrollView style={styles.overlayContentBg}>

						<View style={styles.cardBg}>
							<Text style={styles.aboutLabelTxt}>BIO</Text>
							<Text style={styles.aboutDescriptionTxt}>
								{this.state.user.short_description}
							</Text>

							<View>
								<View style={styles.dividerHorizontal}/>
								<Text style={styles.aboutLabelTxt}>CONSULTAS QUE ATIENDO</Text>
								<Text style={styles.aboutDescriptionTxt}>
									{this.state.registration_purpose}
								</Text>
							</View>

							{this.state.user.specialties && this.state.user.specialties.length ?
							  <View>
								  <View style={styles.dividerHorizontal}/>
								  <Text style={styles.aboutLabelTxt}>ESPECIALIDADES</Text>
								  <Text style={styles.aboutDescriptionTxt}>
									  {this.renderSpecialties()}
								  </Text>
							  </View>
							  : null}
							<View style={styles.dividerHorizontal}/>
							<Text style={styles.aboutLabelTxt}>MATRICULAS</Text>
							<View>
								{this.renderProfessionalsRegistrations()}
							</View>
						</View>

						{this.state.me && this.state.user && this.state.me.id === this.state.user.id ?
						  <View style={styles.cardBg}>
							  <View style={styles.photoImgView}>
								  <TouchableOpacity style={ApplicationStyles.button}
								                    onPress={() => this.goToEditProfileVet()}>
									  <Text style={ApplicationStyles.buttonText}>Editar perfil</Text>
								  </TouchableOpacity>
							  </View>
						  </View>
						  : null}

						  <View style={{height: 60}} />
					</ScrollView>
				</Content>
			</Container>
		);
	}
}
