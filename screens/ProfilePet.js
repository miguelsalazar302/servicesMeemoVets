import React, {Component} from 'react';
import {Text, View, Image, StatusBar, Platform, TouchableOpacity, BackHandler, I18nManager, Alert, ScrollView} from 'react-native';
import {Container, Right, Left, Content, Body, Header, Spinner, Icon} from 'native-base';
import styles from './ProfileVet/styles';
import AuthService from "../modules/AuthService";
import APIService from "../modules/ApiService";
import locales_es from "./../locales/es";
import Helpers from "../modules/Helpers";
import {parseEventDate, renderAge} from "../modules/ViewHelpers";
import USER_TYPE_VET from "../models/constants";

export default class ProfilePet extends Component {

	static navigationOptions = {};

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			isMessageActive: true,
			isFollowed: false,
			avatarSource: null,
			clinicHistories: null,
			petId: this.props.navigation.getParam('petId', 0) // TODO DEBUG
		};

		this.auth = new AuthService();
		this.api = new APIService();
		this.helpers = new Helpers();
	}

	componentWillMount() {
		const that = this;
		BackHandler.addEventListener('hardwareBackPress', () => {
			that.props.navigation.navigate('Home');
			return true;
		});
	}

	componentDidMount() {
		this.load();
	}

	load() {
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
		
		this.api.getPetTypes().then(res => {
			this.setState({
				pet_types: res.data
			}, () => {
				this.api.getPetGenders().then(res => {
					this.setState({
						pet_genders: res.data
					}, () => {
						this.api.getPet(this.state.petId).then(res => {
							this.setState({
								pet: res.data
							});
							this.setPetRace(res.data.pet_type_id);
							this.setPetSize(res.data.pet_type_id);
							this.setPetDiet(res.data.pet_type_id);
							this.setPetHabit(res.data.pet_type_id);

							this.getClinicHistory();

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

	getClinicHistory() {
		this.api.getClinicHistoriesByPetId(this.state.petId).then(res => {
			this.setState({
				clinicHistories: res.data
			});
		}).catch(err => {
			console.log(err)
		});
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

	confirmSelectProfileImage() {
		Alert.alert(
		  '¿Actualizar foto de perfil?',
		  'Recuerda que tu perfil quedará en revisión hasta que validemos que tu nueva foto está correcta',
		  [
			  {
				  text: 'Cancelar',
				  onPress: () => console.log('Cancel Pressed'),
				  style: 'cancel',
			  },
			  {
				  text: 'Actualizar',
				  onPress: () => {
					  this.selectProfileImage();
				  }
			  },
		  ],
		  {cancelable: false},
		);
	}

	getPetGender(id) {
		const result = this.state.pet_genders.filter(item => Number(item.id) === Number(id));
		return result.length ? result[0].name : '';
	}

	getPetType(id) {
		const result = this.state.pet_types.filter(item => Number(item.id) === Number(id));
		return result.length ? result[0].name : '';
	}

	setPetRace(petType) {
		this.api.getPetRaces(petType).then(res => {
			this.setState({
				pet_races: res.data
			}, () => {
				const result = this.state.pet_races.filter(item => Number(item.id) === Number(this.state.pet.pet_race_id));
				this.setState({
					petRace: result.length ? result[0].name : ''
				});
			});
		}).catch(err => reject(err));
	}

	setPetSize(petType) {
		this.api.getPetSizes(petType).then(res => {
			this.setState({
				pet_sizes: res.data
			}, () => {
				const result = this.state.pet_sizes.filter(item => Number(item.id) === Number(this.state.pet.pet_size_id));
				this.setState({
					petSize: result.length ? result[0].name : ''
				});
			});
		}).catch(err => reject(err));
	}

	setPetDiet(petType) {
		this.api.getPetDiets(petType).then(res => {
			this.setState({
				pet_diets: res.data
			}, () => {
				const result = this.state.pet_diets.filter(item => Number(item.id) === Number(this.state.pet.pet_diet_id));
				this.setState({
					petDiet: result.length ? result[0].name : ''
				});
			});
		}).catch(err => reject(err));
	}

	setPetHabit(petType) {
		this.api.getPetHabits(petType).then(res => {
			this.setState({
				pet_habits: res.data
			}, () => {
				const result = this.state.pet_habits.filter(item => Number(item.id) === Number(this.state.pet.pet_habit_id));
				this.setState({
					petHabit: result.length ? result[0].name : ''
				});
			});
		}).catch(err => reject(err));
	}

	renderAdjectives() {
		let text = '';
		const length = this.state.pet.pet_adjectives.length;
		this.state.pet.pet_adjectives.map((specialty, index) => {
			text += specialty.name;
			if ((index + 1) < length) {
				text += ' - ';
			}
		});
		return text;
	}

	goToProfileBooking(bookingId) {
		// this.props.navigation.navigate('ProfileBooking', {bookingId})
		this.props.navigation.push('ProfileBooking', {bookingId})
	}

	goToProfileAppointmentClose(bookingId, petId) {
		this.props.navigation.navigate('ProfileAppointmentClose', {
			bookingId,
			pet_id: petId,
		});
	}

	render() {
		StatusBar.setBarStyle('light-content', true);
		if (Platform.OS === 'android') {
			StatusBar.setBackgroundColor('transparent', true);
			StatusBar.setTranslucent(true);
		}

		const {pet, petRace, petSize, petDiet, petHabit} = this.state;

		return (
		  <Container style={{backgroundColor: '#2d324f'}}>
			  {!pet ? <Spinner/> :
				<Container style={styles.main}>
					<View style={{flexDirection: 'column'}}>
						<View style={styles.profileView}>
							<Image style={styles.profileImg} source={{uri: pet.full_profile_image}}/>
							<Text style={styles.nameTxt}>{pet.name}</Text>
						</View>
						<View style={styles.backBottomView}/>
					</View>
					<ScrollView style={styles.contentView}>
						<View style={styles.overlayContentBg}>

							<View style={styles.cardBg}>
								<Text style={styles.aboutLabelTxt}>ATRIBUTOS</Text>
								<Text style={styles.aboutDescriptionTxt}>
									TIPO: {this.getPetType(pet.pet_type_id)}
								</Text>
								{petRace ?
								  <Text style={styles.aboutDescriptionTxt}>
									  RAZA: {petRace}
								  </Text> : null
								}
								<Text style={styles.aboutDescriptionTxt}>
									SEXO: {this.getPetGender(pet.pet_gender_id)}
								</Text>
								{pet.castrated !== null ?
								  <Text style={styles.aboutDescriptionTxt}>
									  CASTRADO: {pet.castrated ? 'Sí' : 'No'}
								  </Text> : null
								}

								{renderAge(pet.birth_date, styles.aboutDescriptionTxt)}

								{
									petSize ?
									  <Text style={styles.aboutDescriptionTxt}>
										  PESO: {petSize} Kg.
									  </Text> : null
								}
								{
									pet.pet_size_other ?
									  <Text style={styles.aboutDescriptionTxt}>
										  PESO APRÓX.: {pet.pet_size_other} Kg.
									  </Text> : null
								}
								{petDiet ?
								  <Text style={styles.aboutDescriptionTxt}>
									  DIETA: {petDiet}
								  </Text> : null
								}
								{petHabit ?
								  <Text style={styles.aboutDescriptionTxt}>
									  HÁBITOS: {petHabit}
								  </Text> : null
								}
							</View>

							{pet && pet.pet_adjectives && pet.pet_adjectives.length ?
							  <View style={styles.cardBg}>
								  <Text style={styles.aboutLabelTxt}>ADJETIVOS CARACTERÍSTICOS</Text>
								  <Text style={styles.aboutDescriptionTxt}>
									  {this.renderAdjectives()}
								  </Text>
							  </View>
							  : null}

							{pet.chip ?
							  <View style={styles.cardBg}>
								  <View>
									  <Text style={styles.aboutLabelTxt}>CHIP</Text>
									  <Text style={styles.aboutDescriptionTxt}>
										  {pet.chip}
									  </Text>
								  </View>
							  </View>
							  : null}

							{pet.preexisting_diseases &&
							<View style={styles.cardBg}>
								<View>
									<Text style={styles.aboutLabelTxt}>ENFERMEDADES PREEXISTENTES</Text>
									<Text style={styles.aboutDescriptionTxt}>
										{pet.preexisting_diseases}
									</Text>
								</View>
							</View>
							}

							{ this.state.userType == "vet" ?
							<View style={styles.cardBg}>
								<Text style={styles.aboutLabelTxt}>HISTORIA CLÍNICA</Text>
								{this.state.clinicHistories === null ? <Spinner/>
								  : this.state.clinicHistories.length ?
									this.state.clinicHistories.map(history => {
										return(
										  <TouchableOpacity onPress={() => this.goToProfileAppointmentClose(history.booking_id, history.pet_id)}>
											  <View style={[styles.rowBg, {backgroundColor: 'transparent'}]}>
												  <View style={styles.rowHeaderView}>
													  <View style={styles.rowHeaderNameView}>
														  <Text style={styles.rowNameTxt}>{parseEventDate(history.created_at)}</Text>
														  <Text style={styles.rowNameTxt}/>
														  <Text style={styles.rowNameTxt}>DIAGNÓSTICO:</Text>
														  <Text
															style={styles.rowTimeTxt}>{history.diagnosis}</Text>
														  <Text style={styles.rowNameTxt}>INDICACIONES:</Text>
														  <Text
															style={styles.rowTimeTxt}>{history.indications}</Text>
													  </View>
													  <Icon style={{position: 'absolute', right: 5}} name="ios-arrow-forward"/>
												  </View>
											  </View>
										  </TouchableOpacity>
										)
									})
									:
								<Text style={styles.aboutDescriptionTxt}>
									No hay historias clínicas para mostrar aún.
								</Text>
								}
							</View>
							: alert(this.state.userType)}

						</View>
					</ScrollView>
				</Container>
			  }
		  </Container>

		);
	}
}
