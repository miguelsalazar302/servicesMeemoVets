import React, {PropTypes, Component} from 'react';
import {
	Text,
	View,
	Platform,
	Dimensions,
	Image,
	TextInput,
	TouchableOpacity,
	ImageBackground,
	BackHandler,
	I18nManager,
	Alert
} from 'react-native';
import {
	Picker,
	Container,
	Content,
	Button,
	Form,
	Icon,
	Right,
	Item,
	Input,
	Header,
	Left,
	Body,
	Title,
	Grid,
	Spinner
} from 'native-base';
import MultiSelect from 'react-native-multiple-select';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// Screen Styles
import styles from '../containers/Signin_05/styles';

import BgImageVet from './../assets/images/image_bg_signin_five_VET2.jpg';

import {wording} from "../models/wording";
import locales_es from "../locales/es";
import Helpers from "../modules/Helpers";
import AuthService from "../modules/AuthService";
import Loading from "../components/loading";
import {USER_TYPE_SERVICE, USER_TYPE_VET} from "../models/constants";
import ImagePicker from 'react-native-image-picker';
import {EventRegister} from "react-native-event-listeners";
import APIService from "../modules/ApiService";
import Metrics from "../Themes/Metrics";

const instituteObjectModel = {
	registration_number: '',
	name: '',
	professional_registration_institute_id: 0
};

// TODO: UNIFICAR EL FORMULARIO DE REGISTRO/EDICION
export default class RegisterService extends Component {

	static navigationOptions = {
		header: null,
		headerMode: 'none'
	};

	constructor(props) {
		super(props);

		this.state = {
			multiViewToggledList: false,
			selectedItems: [],
			professionalRegistrationInstitutes: [],
			specialtiesData: [],
			specialties: [],
			selectedSpecialty: '',
			errors: [],
			loading: false,
			secureTextEntryActivated: true,
			email: '',
			password: '',
			password_repeat: '',
			name: '',
			lastname: '',
			cuit: '',
			identification: '',
			professional_registration: [Object.assign({}, Object.assign({}, instituteObjectModel))],
			phone: '',
			short_description: '',
			service_type_id: 0,
			registrations_purposes_id: 0,
			registration_purpose: '',
			registration_purposes: [],
			type: USER_TYPE_SERVICE,
			basic_service_description: "",
			//service_name: "",
			services: [],
		};

		this.helpers = new Helpers();
		this.auth = new AuthService();
		this.api = new APIService();
	}

	onSelectedItemsChange = selectedItems => {
		console.log('onSelectedItemsChange');
		console.log(selectedItems);
		let specialties = [];
		selectedItems.forEach(item => {
			specialties.push(
			  {
				  'specialty_id': Number(item)
			  }
			)
		});
		this.setState(
		  {
			  selectedItems,
			  specialties
		  });
	};

	goBack() {
		this.props.navigation.goBack();
	}

	componentDidMount() {
		this.api.getProfessionalRegistrationInstitutes().then(res => {
			this.setState({
				professionalRegistrationInstitutes: res.data
			});
		}).catch(err => {
			console.log(err);
		});
		this.api.getSpecialties().then(res => {
			this.setState({
				specialtiesData: res.data
			});
		}).catch(err => {
			console.log(err);
		});

		this.api.getRegistrationsPurposes().then(res => {
			console.log(res);
			this.setState({
				registration_purposes: res.data
			});
		}).catch(err => {
			console.log(err);
		})

		this.api.getServicesList().then(res => {
			this.setState({
				services: res.data
			});
		}).catch(err => {
			console.log(err);
		});
	}

	checkRegistrationPurposes() {
		return this.state.registrations_purposes_id == "1";
	}

	checkSpecialtiesAndRegister() {
		if (this.checkRegistrationPurposes()) {
			this.setState({
				specialties: []
			}, this.register);
		} else {
			this.register();
		}
	}

	register() {
		let errors = [];
		/*if (!this.state.avatarSource) {
			Alert.alert(wording.global.errorTitle, locales_es.register.errorProfileImageMissing);
			errors.push('profile_image');
			this.setState({
				errors
			});
			return;
		}*/

		if (this.state.service_type_id == 0){
			Alert.alert("Oops...", "Por favor seleccione el servicio que va a brindar")
			return
		}

		if (this.state.type != USER_TYPE_SERVICE){
			if (!this.checkRegistrationPurposes() && !this.state.specialties.length) {
				Alert.alert(wording.global.errorTitle, locales_es.register.errorSpecialtyMissing);
				return;
			}
		}
		// const stateKeys = Object.keys(this.state);
		const stateKeysToCheck = ['email', 'password', 'password_repeat', 'name', 'lastname', 'identification', 'phone', 'short_description', 'basic_service_description'];
		stateKeysToCheck.forEach((key) => {
			if (this.state[key] === '') {
				errors.push(key);
			}
		});

		if (this.state.type != USER_TYPE_SERVICE){
			if (this.state.professional_registration.length) {
				this.state.professional_registration.map((registration) => {
					if (registration.registration_number === '') {
						errors.push('professional_registration');
					}
				});
			}
			this.setState({
				errors
			});
		}
		if (errors.length) {
			// TODO: Revisar wordings en dos lugares distintos
			Alert.alert(wording.global.errorTitle, locales_es.completeAllFields);
			return;
		}
		let checkEmail = this.helpers.validateEmail(this.state.email);
		if (!checkEmail) {
			Alert.alert(wording.global.errorTitle, wording.register.errorEmail);
			return;
		}
		if (this.state.password !== this.state.password_repeat) {
			Alert.alert(wording.global.errorTitle, wording.register.errorPasswordRepeatNotMatched);
			return;
		}
		console.log("ACA")
		console.log(this.state)

		this.setState({loading: true});
		this.auth.register(this.state)
		  .then(() => {
			  this.setState({loading: false});
			  this.successLoginRedirect();
		  }).catch(err => {
/* 			  if (err.message.includes("JSON")){
				this.setState({loading: false});
				this.successLoginRedirect();
			  } */
				this.setState({loading: false});
				Alert.alert('Error', err.message);
		});
		// alert('Registro');*/
	}

	successLoginRedirect() {
		this.setState({loading: true});
		const userData = {
			email: this.state.email,
			password: this.state.password,
			type: this.state.type
		};
		this.auth.login(userData)
		  .then(() => {
			  //this.uploadPhoto(); // Upload Profile Image
			  this.setState({loading: false});
			  this.props.navigation.navigate('WalkthroughVet');
		  }).catch(err => {
			this.setState({loading: false});
			Alert.alert('Error', err.message);
		});
	}

	selectProfileImage() {
		// More info on all the options is below in the API Reference... just some common use cases shown here
		const options = {
			title: 'Cambiar foto de perfil...',
			cancelButtonTitle: 'Cancelar',
			takePhotoButtonTitle: 'Sacar una foto',
			chooseFromLibraryButtonTitle: 'Elegir de la galería de fotos',
			/*customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],*/
			storageOptions: {
				skipBackup: true,
				path: 'images',
			},
		};

		/**
		 * The first arg is the options object for customization (it can also be null or omitted for default options),
		 * The second arg is the callback which sends object: response (more info in the API Reference)
		 */
		ImagePicker.showImagePicker(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
				Alert.alert(wording.global.errorTitle, 'Revisa los permisos de la aplicación');
			} else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				const source = {uri: response.uri};

				// You can also display the image using data:
				// const source = { uri: 'data:image/jpeg;base64,' + response.data };

				this.setState({
					avatarSource: source,
					avatarSourceResponseData: response.data
				});

			}
		});
	}

	uploadPhoto = () => {
		this.api.updateProfileImage(this.state.avatarSourceResponseData).then((res) => {
			console.log(res);
			EventRegister.emit('reload', 'it works!!!');
			// Alert.alert('Éxito', res);
		}).catch((err) => {
			console.log(err);
			EventRegister.emit('reload', 'it works!!!');
			// Alert.alert('Error', err);
		});
	};

	setProfessionalRegistration(value, index) {
		const professionalRegistration = this.state.professional_registration;
		professionalRegistration[index].registration_number = value;
		this.setState({
			professional_registration: professionalRegistration
		})
	}

	setProfessionalRegistrationInstitute(value, index) {
		const professionalRegistration = this.state.professional_registration;
		professionalRegistration[index].professional_registration_institute_id = value;

		this.setState({
			professional_registration: professionalRegistration
		});

		// TODO review and improve later
		if (index === 0) {
			this.setState({
				selectedPickerValue0: value,
			})
		}
		if (index === 1) {
			this.setState({
				selectedPickerValue1: value,
			})
		}
		if (index === 2) {
			this.setState({
				selectedPickerValue2: value,
			})
		}
	}

	renderInstituteSelector() {
		const result = [];
		this.state.professional_registration.map((institute, index) => {
			result.push(
			  <View key={'ViewInstitutePicker' + index}>
				  <TextInput onChangeText={(text) => {
					  this.setProfessionalRegistration(text, index)
				  }}
				             value={this.state.professional_registration[index].registration_number}
				             style={[styles.textInput,
					             this.state.errors.map((k) => {
						             if (k === 'professional_registration') {
							             return styles.textInputError;
						             }
					             })]
				             }
				             placeholder="Nº Matrícula Profesional"
				             placeholderTextColor="#b7b7b7"
				             underlineColorAndroid="transparent"
				             autoCapitalize="none"
				             textAlign={I18nManager.isRTL ? 'right' : 'left'}
				             keyboardType="default"
				  />
				  <View style={styles.pickerView}>
					  <Picker
						selectedValue={
							index > 1 ? this.state.selectedPickerValue2 :
							  index > 0 ? this.state.selectedPickerValue1 :
								this.state.selectedPickerValue0
						}
						key={'pickerKey' + index}
						style={styles.picker}
						onValueChange={(itemValue, itemIndex) =>
						  this.setProfessionalRegistrationInstitute(itemValue, index)
						}>
						  {this.state.professionalRegistrationInstitutes.map(institute => {
							  return (<Picker.Item
								key={'pickerItemKey' + index}
								label={institute.name}
								value={institute.id}/>);
						  })}
					  </Picker>
				  </View>
				  {index > 0 ?
					<View style={styles.tandc}>
						<TouchableOpacity onPress={() => this.removeInstitute(index)}>
							<Text style={styles.linkText}>
								Remover esta matrícula
							</Text>
						</TouchableOpacity>
					</View>
					: null}
			  </View>
			)
		});
		return result;
	}

	addInstitute() {
		const institutes = this.state.professional_registration;
		if (institutes.length < 3) {
			institutes.push(Object.assign({}, instituteObjectModel));
			this.setState({
				professional_registration: institutes
			});
		}
	}

	removeInstitute(index) {
		const institutes = this.state.professional_registration;
		if (institutes.length > 1) {
			institutes.splice(index, 1);
			this.setState({
				professional_registration: institutes
			});
		}
	}

	setSelectedSpecialty(value) {
		this.setState({
			specialty_id: value
		});
	}

	onToggleList() {
		this.setState({
			multiViewToggledList: true
		});
	}

	onClearSelector() {
		this.setState({
			multiViewToggledList: false
		});
		setTimeout(() => console.log(this.state), 1500);
	}

	setRegistrationPurpose(registrations_purposes_id) {
		this.setState({
			registrations_purposes_id: registrations_purposes_id
		});
	}

	setServiceType(service_type_id) {
		this.setState({
			service_type_id: service_type_id,
			//service_name: service_type_id != 0 ? this.state.services[service_type_id - 1].name : null
		});
	}

	toggle(thisValue) {
		let currentState = this.state[thisValue];
		this.setState({
			[thisValue]: !currentState
		})
	}

	render() {
		return (
		  <Container> 
			  <View style={styles.imgContainer}
			                   source={BgImageVet}>

				  {this.state.loading ?
					<Loading/>
					: null}

				  <Header style={styles.header}>
					  <Left style={styles.left}>
						  <TouchableOpacity style={styles.backArrow} onPress={() => this.goBack()}>
							  <FontAwesome name={I18nManager.isRTL ? "angle-right" : "angle-left"} size={30}
							               color="#fff"/>
						  </TouchableOpacity>
					  </Left>
					  <Body style={styles.body}>
					  <Text style={styles.textTitle}>Registrar Servicio</Text>
					  </Body>
					  <Right style={styles.right}/>
				  </Header>

				  <Content>
					  <KeyboardAwareScrollView
						style={{flex: 1}}
						resetScrollToCoords={{x: 0, y: 0}}
						scrollEnabled={true}
					  >
						  {this.state.avatarSource ? null :
							<View style={styles.tandc}>
								<Text style={styles.separatorText}>
									Cargar Imagen de Perfil
								</Text>
							</View>
						  }
						  <View style={{marginTop: 10}}>
							  <TouchableOpacity onPress={() => this.selectProfileImage()}>
								  <Image style={[styles.profileImage, {marginBottom: 0},
									  this.state.errors.map((k) => {
										  if (k === 'profile_image') {
											  return styles.profileImageError;
										  }
									  })]}
								         source={this.state.avatarSource || {uri: 'http://api.meemo.vet/assets/uploads/users/1.png'}}/>
							  </TouchableOpacity>
						  </View>

						  <View style={styles.tandc}>
								<Text style={styles.separatorText}>
								Informanos que brindas
								</Text>
							</View>

							<View style={styles.tandc}>
								<View style={styles.pickerView}>
									<Picker
										selectedValue={this.state.service_type_id}
										key={'pickerKey_service_type'}
										style={styles.picker}
										onValueChange={(itemValue, itemIndex) =>
										this.setServiceType(itemValue)
										}>
										<Picker.Item
												key={'pickerItemKey_service_type'}
												label={"Seleccionar Servicio..."}
												value={0}/>
										{this.state.services.map(service => {
										  return (<Picker.Item
											key={'pickerItemKey_registration_purpose'}
											label={service.name}
											value={service.id}/>);
									    })}
									</Picker>
								</View>
							</View>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Datos Básicos
							  </Text>
						  </View>

						  <TextInput onChangeText={(text) => this.setState({email: text})}
						             value={this.state.email}
						             style={[styles.textInput,
							             this.state.errors.map((k) => {
								             if (k === 'email') {
									             return styles.textInputError;
								             }
							             })]
						             }
						             placeholder="Email"
						             placeholderTextColor="#b7b7b7"
						             underlineColorAndroid="transparent"
						             autoCapitalize="none"
						             textAlign={I18nManager.isRTL ? 'right' : 'left'}
						             keyboardType="email-address"/>
						  <Form>
							  <TextInput onChangeText={(text) => this.setState({password: text})}
							             value={this.state.password}
							             style={[styles.textInput,
								             this.state.errors.map((k) => {
									             if (k === 'password') {
										             return styles.textInputError;
									             }
								             })]
							             }
							             secureTextEntry={this.state.secureTextEntryActivated}
							             blurOnSubmit={false}
							             placeholder="Contraseña"
							             placeholderTextColor="#b7b7b7"
							             underlineColorAndroid="transparent"
							             autoCapitalize="none"
							             textAlign={I18nManager.isRTL ? 'right' : 'left'}
							             keyboardType="default"/>
							  <Icon style={{
								  position: 'absolute',
								  left: Metrics.WIDTH * 0.8,
								  top: 20,
							  }}
							        active name={this.state.secureTextEntryActivated ? 'eye-off' : 'eye'}
							        onPress={() => this.toggle('secureTextEntryActivated')}
							  />
						  </Form>
						  <TextInput onChangeText={(text) => this.setState({password_repeat: text})}
						             value={this.state.password_repeat}
						             style={[styles.textInput,
							             this.state.errors.map((k) => {
								             if (k === 'password_repeat') {
									             return styles.textInputError;
								             }
							             })]
						             }
						             secureTextEntry={this.state.secureTextEntryActivated}
						             blurOnSubmit={false}
						             placeholder="Repetir Contraseña"
						             placeholderTextColor="#b7b7b7"
						             underlineColorAndroid="transparent"
						             autoCapitalize="none"
						             textAlign={I18nManager.isRTL ? 'right' : 'left'}
						             keyboardType="default"/>


						  <TextInput onChangeText={(text) => this.setState({name: text})}
						             value={this.state.name}
						             style={[styles.textInput,
							             this.state.errors.map((k) => {
								             if (k === 'name') {
									             return styles.textInputError;
								             }
							             })]
						             }
						             placeholder="Nombre"
						             placeholderTextColor="#b7b7b7"
						             underlineColorAndroid="transparent"
						             autoCapitalize="words"
						             textAlign={I18nManager.isRTL ? 'right' : 'left'}
						             keyboardType="default"/>
						  <TextInput onChangeText={(text) => this.setState({lastname: text})}
						             value={this.state.lastname}
						             style={[styles.textInput,
							             this.state.errors.map((k) => {
								             if (k === 'lastname') {
									             return styles.textInputError;
								             }
							             })]
						             }
						             placeholder="Apellido"
						             placeholderTextColor="#b7b7b7"
						             underlineColorAndroid="transparent"
						             autoCapitalize="words"
						             textAlign={I18nManager.isRTL ? 'right' : 'left'}
						             keyboardType="default"/>

						  <TextInput onChangeText={(text) => this.setState({identification: text})}
						             value={this.state.identification}
						             style={[styles.textInput,
							             this.state.errors.map((k) => {
								             if (k === 'identification') {
									             return styles.textInputError;
								             }
							             })]
						             }
						             placeholder="DNI"
						             placeholderTextColor="#b7b7b7"
						             underlineColorAndroid="transparent"
						             autoCapitalize="none"
						             textAlign={I18nManager.isRTL ? 'right' : 'left'}
						             keyboardType="numeric"
						  />

						  <TextInput onChangeText={(text) => this.setState({cuit: text})}
						             value={this.state.cuit}
						             style={[styles.textInput,
							             this.state.errors.map((k) => {
								             if (k === 'cuit') {
									             return styles.textInputError;
								             }
							             })]
						             }
						             placeholder="CUIT (Opcional)"
						             placeholderTextColor="#b7b7b7"
						             underlineColorAndroid="transparent"
						             autoCapitalize="words"
						             textAlign={I18nManager.isRTL ? 'right' : 'left'}
						             keyboardType="numeric"
						  />

						  <TextInput onChangeText={(text) => this.setState({phone: text})}
						             value={this.state.phone}
						             style={[styles.textInput,
							             this.state.errors.map((k) => {
								             if (k === 'phone') {
									             return styles.textInputError;
								             }
							             })]
						             }
						             placeholder="Teléfono celular"
						             placeholderTextColor="#b7b7b7"
						             underlineColorAndroid="transparent"
						             autoCapitalize="words"
						             textAlign={I18nManager.isRTL ? 'right' : 'left'}
						             keyboardType="numeric"
						  />

						  <TextInput onChangeText={(text) => this.setState({short_description: text})}
						             value={this.state.short_description}
						             style={[styles.textArea, this.state.errors.map((k) => {
							             if (k === 'short_description') {
								             return styles.textAreaError;
							             }
						             })]}
						             // placeholder="Descripción Corta"
						             placeholder="Describí tu perfil profesional, tu experiencia, y qué ofrecés"
						             placeholderTextColor="#b7b7b7"
						             underlineColorAndroid="transparent"
						             autoCapitalize="sentences"
						             multiline={true}
						             numberOfLines={4}
						             textAlign={I18nManager.isRTL ? 'right' : 'left'}
						             keyboardType="default"/>

						  <TextInput onChangeText={(text) => this.setState({basic_service_description: text})}
						             value={this.state.basic_service_description}
						             style={[styles.textArea, this.state.errors.map((k) => {
							             if (k === 'basic_service_description') {
								             return styles.textAreaError;
							             }
						             })]}
						             // placeholder="Descripción Corta"
						             placeholder="Describí lo que incluye la tarifa basica de tu servicio"
						             placeholderTextColor="#b7b7b7"
						             underlineColorAndroid="transparent"
						             autoCapitalize="sentences"
						             multiline={true}
						             numberOfLines={4}
						             textAlign={I18nManager.isRTL ? 'right' : 'left'}
						             keyboardType="default"/>


						  <View style={styles.tandcondi}>
							  <Text style={styles.textPolicyDescription}>
								  Registrarte en nuestra plataforma implica la aceptación de los
							  </Text>
							  <View style={styles.tandc}>
								  <TouchableOpacity onPress={
									  () => this.helpers.openLink('https://meemo.vet/terminosycondiciones/')
								  }>
									  <Text style={styles.textTermsCondition}>
										  Términos y Condiciones Generales,
									  </Text>
								  </TouchableOpacity>
							  </View>
							  <View style={styles.tandc}>
								  <Text style={styles.and}> de los </Text>
							  </View>
							  <View style={styles.tandc}>
								  <TouchableOpacity onPress={
									  () => this.helpers.openLink('https://meemo.vet/terminosycondicionesveterinarios/')
								  }>
									  <Text style={styles.textTermsCondition}>
										  Términos y Condiciones Particulares
									  </Text>
								  </TouchableOpacity>
							  </View>
							  <View style={styles.tandc}>
								  <Text style={styles.and}> y de la </Text>
							  </View>
							  <View style={styles.tandc}>
								  <TouchableOpacity onPress={
									  () => this.helpers.openLink('https://meemo.vet/politicasdeprivacidad/')
								  }>
									  <Text style={styles.textTermsCondition}>Política de Privacidad</Text>
								  </TouchableOpacity>
							  </View>
						  </View>


						  <TouchableOpacity style={styles.buttonSignIn}
						                    onPress={() => this.checkSpecialtiesAndRegister()}>
							  <Text style={styles.signInText}>Registrar</Text>
						  </TouchableOpacity>

					  </KeyboardAwareScrollView>

				  </Content>

			  </View>

		  </Container>
		);
	}
}
