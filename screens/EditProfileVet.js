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
import {Picker, Container, Content, Right, Header, Left, Body, Spinner} from 'native-base';
import MultiSelect from 'react-native-multiple-select';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Screen Styles
import styles from './../containers/Signin_05/styles';

import {wording} from "../models/wording";
import locales_es from "../locales/es";
import Helpers from "../modules/Helpers";
import AuthService from "../modules/AuthService";
import Loading from "../components/loading";
import {USER_TYPE_PET_OWNER, USER_TYPE_SERVICE, USER_TYPE_VET} from "../models/constants";
import ImagePicker from 'react-native-image-picker';
import {EventRegister} from "react-native-event-listeners";
import APIService from "../modules/ApiService";

const instituteObjectModel = {
	registration_number: '',
	name: ''
};

// TODO: UNIFICAR EL FORMULARIO DE REGISTRO/EDICION
export default class RegisterVet extends Component {

	static navigationOptions = {
		header: null,
		headerMode: 'none'
	};

	constructor(props) {
		super(props);
		this.state = {
			userId: this.props.navigation.getParam('userId', 0),
			multiSelect: '',
			multiViewToggledList: false,
			selectedItems: [],
			professionalRegistrationInstitutes: [],
			specialtiesData: [],
			specialties: [],
			selectedSpecialty: '',
			errors: [],
			loading: true,
			email: '',
			name: '',
			identification: '',
			lastname: '',
			cuit: '',
			professional_registration: [Object.assign({}, Object.assign({}, instituteObjectModel))],
			registration_purposes: [],
			phone: '',
			short_description: '',
			registrations_purposes_id: null,
			type: USER_TYPE_VET
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

	componentDidMount() {

		this.auth.getLocalUserData().then( res => {
			if (res.type == USER_TYPE_SERVICE){
				this.api.getServiceByUserId(this.state.userId).then(res => {
					this.setState({
						email: res.data.email,
						name: res.data.name,
						lastname: res.data.lastname,
						identification: res.data.identification,
						cuit: res.data.cuit,
						phone: res.data.phone,
						short_description: res.data.short_description,
						full_profile_image: res.data.full_profile_image,
						basic_service_description: res.data.basic_service_description,
						type: USER_TYPE_SERVICE
						// selectedItems: res.data.specialties.map(spec => spec.id),
					}, () => this.hideLoading())
			    })

			}
			else {
				this.api.getProfessionalRegistrationInstitutes().then(res => {
					this.setState({
						professionalRegistrationInstitutes: res.data
					});
		
					this.api.getSpecialties().then(res => {
						this.setState({
							specialtiesData: res.data
						});
					});
		
					this.api.getVetByUserId(this.state.userId).then(res => {
						this.setState({
							email: res.data.email,
							name: res.data.name,
							lastname: res.data.lastname,
							identification: res.data.identification,
							cuit: res.data.cuit,
							phone: res.data.phone,
							short_description: res.data.short_description,
							full_profile_image: res.data.full_profile_image,
							registrations_purposes_id: res.data.registrations_purposes_id,
							// selectedItems: res.data.specialties.map(spec => spec.id),
						}, () => {
							const specialties = res.data.specialties.map(spec => spec.id);
							this.onSelectedItemsChange(specialties);
							this.hideLoading();
						});
		
						this.setInitialProfessionalRegistrations(res.data.professionals_registrations);
		
						this.api.getRegistrationsPurposes().then(res => {
							console.log(res);
							this.setState({
								registration_purposes: res.data
							});
						}).catch(err => {
							console.log(err);
						});
					});
		
				}).catch(err => {
					console.log(err);
				});
			}
		})
	}

	setRegistrationPurpose(registrations_purposes_id) {
		this.setState({
			registrations_purposes_id: registrations_purposes_id
		});
	}


	confirmProfileUpdate() {
		Alert.alert(
		  '¿Actualizar tus datos de perfil?',
		  'Recuerda que tu perfil quedará en revisión hasta que validemos que tus datos nuevos son correctos',
		  [
			  {
				  text: 'Cancelar',
				  onPress: () => console.log('Cancel Pressed'),
				  style: 'cancel',
			  },
			  {
				  text: 'Actualizar',
				  onPress: () => {
					  this.register();
				  }
			  },
		  ],
		  {cancelable: false},
		);
	}

	register() {
		console.log('register state:');
		console.log(this.state);
		/*if (!this.state.full_profile_image && !this.state.avatarSource) {
			Alert.alert(wording.global.errorTitle, locales_es.register.errorProfileImageMissing);
			return;
		}*/
		if (!this.state.specialties.length && this.state.type == USER_TYPE_VET) {
			Alert.alert(wording.global.errorTitle, locales_es.register.errorSpecialtyMissing);
			return;
		}
		let errors = [];
		// const stateKeys = Object.keys(this.state);
		const stateKeysToCheck = ['email', 'password', 'password_repeat', 'name', 'lastname', 'identification', 'phone', 'short_description'];
		stateKeysToCheck.forEach((key) => {
			if (this.state[key] === '') {
				errors.push(key);
			}
		});

		if (this.state.professional_registration.length &&  this.state.type == USER_TYPE_VET) {
			this.state.professional_registration.map((registration) => {
				if (registration.registration_number === '') {
					errors.push('professional_registration');
				}
			});
		}
		this.setState({
			errors
		});
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

		this.setState({loading: true});

		const stateKeys = Object.keys(this.state);
		const userData = {};
		stateKeys.map(key => key !== 'multiSelect' ? userData[key] = this.state[key] : null);

		this.api.updateUser(userData)
		  .then((res) => {
			  this.hideLoading();
			  Alert.alert(wording.global.successTitle, res.message);
			  this.goBack();
		  }).catch(err => {
			this.hideLoading();
			console.log(err.response.data.message);
			const errorMsg = err.response && err.response.data && err.response.data.message
			  ? err.response.data.message : err.message;
			Alert.alert(wording.global.errorTitle, errorMsg);
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
			Alert.alert('Imagen actualizada.', 'Te avisaremos cuándo reactivaremos tu cuenta.');
			this.auth.logout();
			this.props.navigation.navigate('Login');
			// Alert.alert('Éxito', res);
		}).catch((err) => {
			console.log(err);
			EventRegister.emit('reload', 'it works!!!');
			// Alert.alert('Error', err);
		});
	};

	setInitialProfessionalRegistrations(proRegs) {
		const institutes = [];
		proRegs.forEach((pr, index) => {
			if (institutes.length < 3) {
				institutes.push(Object.assign({}, instituteObjectModel));
				institutes[index].registration_number = pr.registration_number;
				institutes[index].name = pr.name;
			}
		});
		this.setState({
			professional_registration: institutes
		}, () => proRegs.forEach((pr, index) => {
			this.setProfessionalRegistrationInstitute(pr.id, index);
		}));
	}

	setProfessionalRegistration(value, index) {
		const professionalRegistration = this.state.professional_registration;
		professionalRegistration[index].registration_number = value;
		this.setState({
			professional_registration: professionalRegistration
		})
	}

	setProfessionalRegistrationInstitute(value, index) {
		console.log('setProfessionalRegistrationInstitute:');
		console.log(value);
		console.log(index);
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
				             autoCapitalize="words"
				             textAlign={I18nManager.isRTL ? 'right' : 'left'}
				             keyboardType="default"/>
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
		console.log('onToggleList');
		this.setState({
			multiViewToggledList: true
		});
		console.log(this.state);
	}

	onClearSelector() {
		console.log('onClearSelector');
		this.setState({
			multiViewToggledList: false
		});
		setTimeout(() => console.log(this.state), 1500);
	}


	render() {
		return (
		  this.state.loading ?
			<Container style={{backgroundColor: '#2d324f'}}>
				<Header style={styles.header}>
					<Left style={styles.left}>
						<TouchableOpacity style={styles.backArrow} onPress={() => this.goBack()}>
							<FontAwesome name={I18nManager.isRTL ? "angle-right" : "angle-left"} size={30}
							             color="#fff"/>
						</TouchableOpacity>
					</Left>
					<Body style={styles.body}>
					<Text style={styles.textTitle}>Editar Perfil</Text>
					</Body>
					<Right style={styles.right}/>
				</Header>
				<Content>
					<View style={styles.logoSec}>
						<Spinner/>
					</View>
				</Content>
			</Container>
			:
			<Container style={{backgroundColor: '#2d324f'}}>
				<Header style={styles.header}>
					<Left style={styles.left}>
						<TouchableOpacity style={styles.backArrow} onPress={() => this.goBack()}>
							<FontAwesome name={I18nManager.isRTL ? "angle-right" : "angle-left"} size={30}
							             color="#fff"/>
						</TouchableOpacity>
					</Left>
					<Body style={styles.body}>
					<Text style={styles.textTitle}>Editar Perfil</Text>
					</Body>
					<Right style={styles.right}/>
				</Header>

				<Content>
					<View style={styles.logoSec}>
						<TouchableOpacity onPress={() => this.selectProfileImage()}>
							<Image style={styles.profileImage}
							       source={this.state.avatarSource || {uri: this.state.full_profile_image}}/>
						</TouchableOpacity>
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
					           editable={false}
					           placeholder="Email"
					           placeholderTextColor="#b7b7b7"
					           underlineColorAndroid="transparent"
					           autoCapitalize="none"
					           textAlign={I18nManager.isRTL ? 'right' : 'left'}
					           keyboardType="email-address"/>

					<TextInput onChangeText={(text) => this.setState({name: text})}
					           value={this.state.name}
					           style={[styles.textInput,
						           this.state.errors.map((k) => {
							           if (k === 'name') {
								           return styles.textInputError;
							           }
						           })]
					           }
					           editable={false}
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
					           editable={false}
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
					           editable={false}
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
					           placeholder="CUIT"
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
					           keyboardType="default"/>

					<TextInput onChangeText={(text) => this.setState({short_description: text})}
					           value={this.state.short_description}
					           style={[styles.textArea, this.state.errors.map((k) => {
						           if (k === 'short_description') {
							           return styles.textAreaError;
						           }
					           })]}
					           placeholder="Descripción Corta"
					           placeholderTextColor="#b7b7b7"
					           underlineColorAndroid="transparent"
					           autoCapitalize="words"
					           multiline={true}
					           numberOfLines={4}
					           textAlign={I18nManager.isRTL ? 'right' : 'left'}
					           keyboardType="default"/>

					{this.state.type == USER_TYPE_SERVICE &&
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
					}

				    {this.state.type == USER_TYPE_VET && 
					<View style={styles.tandc}>
						<Text style={styles.separatorText}>
							Matrículas:
						</Text>
					</View>
					}

					{this.state.type == USER_TYPE_VET ? this.renderInstituteSelector() : null}

					{this.state.professional_registration.length < 3 && this.state.type == USER_TYPE_VET ?
					  <View style={styles.tandc}>
						  <TouchableOpacity onPress={() => this.addInstitute()}>
							  <Text style={styles.linkText}>
								  Agregar otra matrícula
							  </Text>
						  </TouchableOpacity>
					  </View>
					  : null
					}

					{this.state.type == USER_TYPE_VET &&
					<View> 
					<View style={styles.tandc}>
						<Text style={styles.separatorText}>
							Tipo de Consultas a Atender:
						</Text>
					</View>

					<View style={styles.tandc}>
						<View style={styles.pickerView}>
							<Picker
							  selectedValue={this.state.registrations_purposes_id}
							  key={'pickerKey_registration_purpose'}
							  style={styles.picker}
							  onValueChange={(itemValue, itemIndex) =>
								this.setRegistrationPurpose(itemValue)
							  }>
								{this.state.registration_purposes.map(purpose => {
									return (<Picker.Item
									  key={'pickerItemKey_registration_purpose'}
									  label={purpose.name}
									  value={purpose.id}/>);
								})}
							</Picker>
						</View>
					</View>

					<View style={styles.tandc}>
						<Text style={styles.separatorText}>
							Especialidades:
						</Text>
					</View>
					<View style={styles.pickerViewMultiSelect}>
						<MultiSelect
						  styleDropdownMenu={styles.pickerMultiSelectDropdownMenu}
						  styleDropdownMenuSubsection={styles.pickerMultiSelectDropdownMenuSubsection}
						  styleInputGroup={styles.pickerMultiSelect}
						  styleItemsContainer={styles.pickerMultiSelect}
						  styleListContainer={styles.pickerMultiSelect}
						  styleMainWrapper={styles.pickerMultiSelectTransparent}
						  styleRowList={styles.pickerMultiSelect}
						  styleTextDropdownSelected={styles.pickerMultiSelect}
						  styleSelectorContainer={styles.pickerMultiSelectSelectorContainer}
						  styleTextDropdown={styles.pickerMultiSelectText}
						  hideTags
						  items={this.state.specialtiesData}
						  uniqueKey="id"
						  ref={(component) => {
							  this.multiSelect = component
						  }}
						  onSelectedItemsChange={this.onSelectedItemsChange}
						  selectedItems={this.state.selectedItems}
						  selectText="Elige tus especialidades"
						  searchInputPlaceholderText="Buscar Especialidades..."
						  onChangeInput={(text) => {
							  console.log('onChangeInput');
							  console.log(text);
						  }}
						  tagRemoveIconColor="#fff"
						  tagBorderColor="#fff"
						  tagTextColor="#fff"
						  selectedItemTextColor="#51CBBF"
						  selectedItemIconColor="#51CBBF"
						  itemTextColor="#000"
						  displayKey="name"
						  searchInputStyle={{color: '#CCC'}}
						  submitButtonColor="#51CBBF"
						  submitButtonText="Enviar"
						  onToggleList={() => this.onToggleList()}
						  onAddItem={() => console.log('onAddItem')}
						  onClearSelector={() => this.onClearSelector()}
						/>
						<View>
							{this.multiSelect
							  ? this.multiSelect.getSelectedItemsExt(this.state.selectedItems)
							  : null
							}
						</View>
					</View>
					</View>
	}

					<TouchableOpacity style={styles.buttonSignIn} onPress={() => this.confirmProfileUpdate()}>
						<Text style={styles.signInText}>Actualizar</Text>
					</TouchableOpacity>

				</Content>
			</Container>
		);
	}
}
