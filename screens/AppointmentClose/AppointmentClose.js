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
	Alert,
	Modal
} from 'react-native';
import {
	Picker,
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
	Spinner
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import CheckBox from "react-native-check-box";

import RNModal from "react-native-modal";

import FloatingLabelInput from '../../components/FloatingLabelInput';

import DatePicker from 'react-native-datepicker';

import ImageView from "react-native-image-viewing";

import {Col, Row, Grid} from "react-native-easy-grid";

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// Screen Styles
import styles from './../../containers/Signin_05/styles';
import AppStyles from './../../Themes/ApplicationStyles';
import addressStyles from './../Address/styles';


import locales_es from "./../../locales/es";
import Helpers from "./../../modules/Helpers";
import AuthService from "./../../modules/AuthService";
import Loading from "./../../components/loading";
import ImagePicker from 'react-native-image-picker';
import {EventRegister} from "react-native-event-listeners";
import APIService from "./../../modules/ApiService";
import {Images, Metrics} from "../../Themes";

import MultiSelect from 'react-native-multiple-select';

import {parseEventDate} from "../../modules/ViewHelpers";

export default class AppointmentClose extends Component {

	static navigationOptions = {
		title: 'Cerrar Consulta',
		headerTitleStyle: {
			alignSelf: 'center',
			textAlign: 'center'
		},
	};

	constructor(props) {
		super(props);

		this.state = {
			booking_id: this.props.navigation.getParam('booking_id', 0),
			pet_id: this.props.navigation.getParam('pet_id', 0),
			booking: '',
			anamnesis: '',
			general_objective_exam: '',
			particular_objective_exam: '',
			diagnosis: '',
			indications: '',
			applied_treatment: '',
			deworming: false,
			modalForControls: false,
			doneModalVisible: false,
			controls: [],
			appointmentVaccine: '',
			appointmentType: '',
			vaccinesData: [],
			multiViewToggledList: false,
			selectedItems: [],
			images: [],
			errors: [],
			vaccines: [],
			loading: false,
			loadingText: '',
			hasVaccines: false,
			clinicHistory: [],
			update: false,
			id: 0,
			save: false,
			vax_names: [],
			parsedImages: [],
			showImages: false,
			showImagesIndex: 0,
			petVaccines: [],
		};

		this.helpers = new Helpers();
		this.auth = new AuthService();
		this.api = new APIService();
	}

	goBack() {
		this.props.navigation.goBack();
	}

	showLoading(loadingText) {
		this.setState({
			loading: true,
			loadingText
		});
	}

	hideLoading() {
		this.setState({
			loading: false
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

	onSelectedItemsChange = selectedItems => {
		console.log('onSelectedItemsChange');
		console.log(this.state.petVaccines)
		console.log(selectedItems);
		let vaccines = [];
		selectedItems.forEach(item => {
			for (vaccine of this.state.petVaccines){
				if (item == vaccine.id){
					vaccines.push(vaccine)
				}
			}
		});
		console.log(vaccines)
		this.setState(
		  {
			  selectedItems,
			  vaccines: vaccines
		  });
		console.log(this.state.vaccines)
	};


	componentDidMount() {
		this.api.getBookingById(this.state.booking_id).then(res => {
			this.setState({
				booking: res.data
			});
		}).catch(err => {
			Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
		});

		this.api.getClinicHistoriesByBookingId(this.state.booking_id).then(res => {
			if (res.data == null){
				this.setState({clinicHistory: []})
			} else {
			this.setState({clinicHistory: res.data})
			}
			if (this.state.clinicHistory){
				this.setState({
					update: res.data == null ? false : true,
					id: this.state.clinicHistory.id,
					anamnesis: this.state.clinicHistory.anamnesis,
					general_objective_exam: this.state.clinicHistory.general_objective_exam,
					particular_objective_exam: this.state.clinicHistory.particular_objective_exam,
					diagnosis: this.state.clinicHistory.diagnosis,
					indications: this.state.clinicHistory.indications,
					applied_treatment: this.state.clinicHistory.applied_treatment,
					deworming: this.state.clinicHistory.deworming == 1 ? true : false,
				})
			}}).catch(err => {
				Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
			});

		this.api.getPet(this.state.pet_id).then(res => {
			this.setState({
				pet: res.data
			}, () => {
				this.getVaccines();
				this.api.getPetVaccines(this.state.pet.pet_type_id).then(res => {
					console.log(res.data)
					vax_names = []
					for (vaccine of this.state.clinicHistory.vaccines){
						if (vaccine.pet_vaccine_id != 3 || vaccine.pet_vaccine_id != 6){
							for (vax_name of res.data){
								if(vaccine.pet_vaccine_id == vax_name.id){
									vax_names.push(vax_name.name)
									break
								}
							}
						} 
						else {
							vax_names.push(vaccine.other_text)
						}
					}
					let petVaccines = []
					for (vaccine of res.data){
						if (!vaccine.code.includes("Otra")){
							petVaccines.push(vaccine)
						}
					}
					this.setState({
						petVaccines: petVaccines,
						vax_names: vax_names
					}); 
					
				});
			});
		}).catch(err => {
			Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
		});
		console.log("VAX")
		console.log(this.state)
		this.parseImages();
		
	}

	getVaccines() {
		this.api.getPetVaccines(this.state.pet.pet_type_id).then(res => {
			const vaccines = [res.data[0]];
			console.log("here")
			console.log(res.data);
			let vaccinesData = []
			for (vaccine of res.data){
				if (!vaccine.name.includes("Otra")){
					vaccinesData.push(vaccine)
				}
			}
			this.setState({
				vaccinesData: vaccinesData,
				vaccines,
			});
		}).catch(err => {
			Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
		});
	}

	parseImages() {
		if(this.state.clinicHistory && this.state.clinicHistory.images && this.state.clinicHistory.images.length) {
			let images = JSON.parse(JSON.stringify(this.state.clinicHistory.images));
			images = images.map(image => {
				image.uri = image.full_image_url;
				return image;
			});
			this.setState({
				parsedImages: images
			});
			console.log("IMGS")
			console.log(this.state.parsedImages)
		}
	}

	addImage() {
		// More info on all the options is below in the API Reference... just some common use cases shown here
		const options = {
			title: 'Agregar foto...',
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
			//console.log('Response = ', response);

			if (response.didCancel) {
				//console.log('User cancelled image picker');
			} else if (response.error) {
				//console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				//console.log('User tapped custom button: ', response.customButton);
			} else {
				const source = {uri: response.uri};

				// You can also display the image using data:
				// const source = { uri: 'data:image/jpeg;base64,' + response.data };

				const images = JSON.parse(JSON.stringify(this.state.images));

				images.push({
					avatarSource: source,
					avatarSourceResponseData: response.data
				});

				this.setState({
					images,
				});

			}
		});
	}

	removeImage(index) {
		const images = JSON.parse(JSON.stringify(this.state.images));
		images.splice(index, 1);
		this.setState({
			images
		});
	}

	uploadPhoto = (clinicHistoryId, image) => {
		this.api.updateHistoryClinicImage(clinicHistoryId, image.avatarSourceResponseData).then((res) => {
			//console.log(res);
			EventRegister.emit('reloadBookings', 'it works!!!');
			Alert.alert(locales_es.successModal.title, res.data.message);
			this.hideLoading();
		}).catch((err) => {
			//console.log(err);
			// EventRegister.emit('reload', 'it works!!!');
			Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
			this.hideLoading();
		});
	};

	setVaccine(value, index) {
		const vaccinesData = JSON.parse(JSON.stringify(this.state.vaccinesData));
		const vaccines = JSON.parse(JSON.stringify(this.state.vaccines));
		vaccines[index] = vaccinesData.filter(vaccine => vaccine.id == value)[0];
		this.setState({
			vaccines
		});
		console.log(this.state.vaccines)
	}

	setVaccineOther(value, index) {
		const vaccines = JSON.parse(JSON.stringify(this.state.vaccines));
		vaccines[index].other_text = value;
		this.setState({
			vaccines
		});
	}

	/*renderVaccineSelector() {
		return this.state.vaccines.map((vaccine, index) => {
			return (
			  <View>
				  <View key={'ViewTypePicker' + index}>
					  <View style={styles.pickerView}>
						  <Picker
							selectedValue={this.state.vaccines[index].id}
							key={'pickerTypeKey' + index}
							style={styles.picker}
							onValueChange={(itemValue) =>
							  this.setVaccine(itemValue, index)
							}
						  >
							  {this.state.vaccinesData.map(type => {
								  return (<Picker.Item
									key={'pickerItemTypeKey'}
									label={type.name}
									value={type.id}/>);
							  })}
						  </Picker>
					  </View>
					  <View style={{height: 10}}/>
					  {this.state.vaccines[index].editable ?
						<TextInput onChangeText={(text) => {
							this.setVaccineOther(text, index);
						}}
						           value={this.state.name}
						           style={[styles.textInput,
							           this.state.errors.map((k) => {
								           if (k === 'otherText' + index) {
									           return styles.textInputError;
								           }
							           })]
						           }
						           placeholder="Otro..."
						           placeholderTextColor="#b7b7b7"
						           underlineColorAndroid="transparent"
						           autoCapitalize="words"
						           textAlign={I18nManager.isRTL ? 'right' : 'left'}
						           keyboardType="default"/>
						: null}
				  </View>

				  {index > 0 ?
					<View style={styles.tandc}>
						<TouchableOpacity onPress={() => this.removeVaccine(index)}>
							<Text style={styles.linkText}>
								Remover vacuna
							</Text>
						</TouchableOpacity>
					</View>
					: null}
			  </View>
			);
		});
	}*/

	setAppointmentVaccine(value) {
		this.setState({
			appointmentVaccine: value
		})
	}

	setSelectedSpecialty(value) {
		this.setState({
			specialty_id: value
		});
	}

	toggleSortModal(visible) {
		this.setState({modalForControls: visible});
		console.log('true');
	}

	_handleSortModal() {
		this.setState({modalForControls: false});
		this.toggleSortModal(true);
	}

	pushControl() {

		if (!this.state.controlParsedDate || !this.state.controlReason) {
			Alert.alert(locales_es.errorModal.title, 'Complete todos los datos');
			return;
		}

		this.setState({modalForControls: false});
		const controls = JSON.parse(JSON.stringify(this.state.controls));
		controls.push({
			date: this.state.controlParsedDate,
			reason: this.state.controlReason,
		});
		this.setState({
			controls,
			date: null,
			controlParsedDate: null,
			controlReason: '',
		});
	}

	removeControl(index) {
		const controls = JSON.parse(JSON.stringify(this.state.controls));
		controls.splice(index, 1);
		this.setState({
			controls,
		});
	}

	renderControls() {
		return (
		  this.state.controls.map((item, index) => {
			  return (
				<View style={AppStyles.listCardsRow} key={index}>
					<View style={AppStyles.listCardsRowHeaderView}>
						<View style={AppStyles.listCardsRowHeaderNameView}>
							<Text style={AppStyles.listCardsRowNameTxt}>Próximo Control</Text>
							<Text style={AppStyles.listCardsRowTimeTxt}>{parseEventDate(item.date)}</Text>
						</View>
						<Right style={AppStyles.listCardsRowMoreIcon}>
							<TouchableOpacity onPress={() => this.removeControl(index)}>
								<Ionicons name="ios-remove-circle" size={25} color="#d4d4d4"/>
							</TouchableOpacity>
						</Right>
					</View>
					<View style={AppStyles.listCardsRowDescriptionView}>
						<Text style={AppStyles.listCardsRowDescTxt}>{item.reason}</Text>
					</View>
					<View style={{height: 10}}/>
				</View>
			  );
		  })
		);
	}

	_showSuccessModal = () => this.setState({doneModalVisible: true});

	goToMain() {
		console.log(this.props.navigation);
		this.props.navigation.navigate("MyAppointments");
	}

	_hideModal = () => {
		this.setState({doneModalVisible: false}, this.goToMain);
	};

	checkboxCheck() {
		this.setState({
			deworming: !this.state.deworming,
		});
	}

	checkboxVaccineCheck() {
		this.setState({
			hasVaccines: !this.state.hasVaccines,
		});
	}

	removeFromErrors(string) {
		let errors = JSON.parse(JSON.stringify(this.state.errors));
		errors = errors.filter(item => item !== string);
		this.setState({
			errors
		});
	}

	validateForm() {
		let errors = [];
		// const stateKeys = Object.keys(this.state);
		const stateKeysToCheck = [
			'anamnesis',
			'general_objective_exam',
			'particular_objective_exam',
			'diagnosis',
			'applied_treatment',
			'indications',
		];

		stateKeysToCheck.forEach((key) => {
			if (this.state[key] === '' || this.state[key] === 0) {
				errors.push(key);
			}
		});

		this.setState({
			errors
		});

		if (errors.length) {
			Alert.alert(locales_es.errorModal.title, locales_es.completeAllFields);
			return false;
		}
		return true;
	}

	addVaccine() {
		const vaccines = JSON.parse(JSON.stringify(this.state.vaccines));
		vaccines.push(this.state.vaccinesData[0]);
		this.setState({
			vaccines
		});
	}

	removeVaccine(index) {
		const vaccines = JSON.parse(JSON.stringify(this.state.vaccines));
		if (vaccines.length > 1) {
			vaccines.splice(index, 1);
			this.setState({
				vaccines
			});
		}
	}

	showImages(index) {
		this.setState({
			showImages: true,
			showImagesIndex: index
		});
	}

	save() {
		this.showLoading('Guardando Historia Clínica...');
		const obj = JSON.parse(JSON.stringify(this.state));
		obj['save'] = true;
		fill_keys = ['anamnesis', 'general_objective_exam', 'particular_objective_exam', 'diagnosis', 'applied_treatment', 'indications']
		for (key of fill_keys){
			if (obj[key] == undefined){
				obj[key] = ''
			}
			//console.log(obj[key])
		}
		delete obj.images;
		if (!this.state.hasVaccines){
			obj['vaccines'] = []
		}
		//console.log(obj);
		if (!this.state.update){
			this.api.postClinicHistory(obj).then(res => {
				Alert.alert(locales_es.successModal.title, 'Historia clinica guardada correctamente');
				if (this.state.images.length) {
					this.state.images.map((image, index) => {
						this.showLoading('Subiendo Imagenes. Espere unos momentos...');
						this.uploadPhoto(res.data.id, image);
						if (index === this.state.images.length) {
							this.goBack();
							this.hideLoading();
						}
					});
				} else {
					this.hideLoading();
					this.goBack();
				}
				EventRegister.emit('reloadBookings');
				this.goBack();

		}).catch(err => {
			//Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
			//alert(JSON.stringify(res.data))
			this.hideLoading();
		})}
		else {
			this.api.putClinicHistory(obj).then(res => {
				Alert.alert(locales_es.successModal.title, 'Historia clinica guardada correctamente');
				if (this.state.images.length) {
					this.state.images.map((image, index) => {
						this.showLoading('Subiendo Imagenes. Espere unos momentos...');
						this.uploadPhoto(res.data.id, image);
						if (index === this.state.images.length) {
							this.goBack();
							this.hideLoading();
						}
					});
				} else {
					this.hideLoading();
					this.goBack();
				}
				EventRegister.emit('reloadBookings');
				this.goBack();

		}).catch(err => {
			Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
			this.hideLoading();
		})};
	}

	send() {
		if (this.validateForm()) {
			this.showLoading('Guardando Historia Clínica...');
			const obj = JSON.parse(JSON.stringify(this.state));
			delete obj.images;
			if (!this.state.hasVaccines){
				obj['vaccines'] = []
			};
			if (!this.state.update){
				this.api.postClinicHistory(obj).then(res => {
					Alert.alert(locales_es.successModal.title, 'Historia clinica guardada correctamente');
					if (this.state.images.length) {
						this.state.images.map((image, index) => {
							this.showLoading('Subiendo Imagenes. Espere unos momentos...');
							this.uploadPhoto(res.data.id, image);
							if (index === this.state.images.length) {
								this.goBack();
								this.hideLoading();
							}
						});
					} else {
						this.hideLoading();
						this.goBack();
					}
					EventRegister.emit('reloadBookings');
					this.goBack();
	
			}).catch(err => {
				Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
				this.hideLoading();
			})}
			else {
				this.api.putClinicHistory(obj).then(res => {
					Alert.alert(locales_es.successModal.title, 'Historia clinica guardada correctamente');
					if (this.state.images.length) {
						this.state.images.map((image, index) => {
							this.showLoading('Subiendo Imagenes. Espere unos momentos...');
							this.uploadPhoto(res.data.id, image);
							if (index === this.state.images.length) {
								this.goBack();
								this.hideLoading();
							}
						});
					} else {
						this.hideLoading();
						this.goBack();
					}
					EventRegister.emit('reloadBookings');
					this.goBack();
	
			}).catch(err => {
				Alert.alert(locales_es.errorModal.title, this.helpers.getErrorMsg(err));
				this.hideLoading();
			})};
		}
	}

	render() {

		const {booking} = this.state;

		return (
		  <Container style={AppStyles.forms.container}>
			  {this.state.loading ?
				<Loading text={this.state.loadingText}/>
				: null}

			  <Content>
				  <KeyboardAwareScrollView
					style={{flex: 1}}
					resetScrollToCoords={{x: 0, y: 0}}
					scrollEnabled={true}
				  >
					  <View>
						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Motivo de Consulta:
							  </Text>
						  </View>
						  {booking && booking.reason ?
							<View style={[styles.tandc]}>
								<Text style={{fontSize: 22}}>{booking.reason}</Text>
							</View>
							: <Spinner/>
						  }
						  <View style={{height: 10}}/>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Anamnesis:
							  </Text>
						  </View>
						  <TextInput onChangeText={(text) => this.setState({anamnesis: text})}
						             onBlur={() => this.removeFromErrors('anamnesis')}
						             value={this.state.anamnesis}
						             style={[styles.textArea, this.state.errors.map((k) => {
							             if (k === 'anamnesis') {
								             return styles.textAreaError;
							             }
						             })]}
						             placeholder="Anamnesis..."
						             placeholderTextColor="#b7b7b7"
						             underlineColorAndroid="transparent"
						             autoCapitalize="sentences"
						             multiline={true}
						             numberOfLines={4}
						             textAlign={I18nManager.isRTL ? 'right' : 'left'}
						             editable={true}
						             keyboardType="default"/>
						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Examen objetivo general:
							  </Text>
						  </View>
						  <TextInput onChangeText={(text) => this.setState({general_objective_exam: text})}
						             onBlur={() => this.removeFromErrors('general_objective_exam')}
						             value={this.state.general_objective_exam}
						             style={[styles.textArea, this.state.errors.map((k) => {
							             if (k === 'general_objective_exam') {
								             return styles.textAreaError;
							             }
						             })]}
						             placeholder="Examen objetivo general..."
						             placeholderTextColor="#b7b7b7"
						             underlineColorAndroid="transparent"
						             autoCapitalize="sentences"
						             multiline={true}
						             numberOfLines={4}
						             textAlign={I18nManager.isRTL ? 'right' : 'left'}
						             editable={true}
						             keyboardType="default"/>
						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Examen objetivo particular:
							  </Text>
						  </View>
						  <TextInput onChangeText={(text) => this.setState({particular_objective_exam: text})}
						             onBlur={() => this.removeFromErrors('particular_objective_exam')}
						             value={this.state.particular_objective_exam}
						             style={[styles.textArea, this.state.errors.map((k) => {
							             if (k === 'particular_objective_exam') {
								             return styles.textAreaError;
							             }
						             })]}
						             placeholder="Examen objetivo particular..."
						             placeholderTextColor="#b7b7b7"
						             underlineColorAndroid="transparent"
						             autoCapitalize="sentences"
						             multiline={true}
						             numberOfLines={4}
						             textAlign={I18nManager.isRTL ? 'right' : 'left'}
						             editable={true}
						             keyboardType="default"/>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Diagnóstico Presuntivo:
							  </Text>
						  </View>
						  <TextInput onChangeText={(text) => this.setState({diagnosis: text})}
						             onBlur={() => this.removeFromErrors('diagnosis')}
						             value={this.state.diagnosis}
						             style={[styles.textArea, this.state.errors.map((k) => {
							             if (k === 'diagnosis') {
								             return styles.textAreaError;
							             }
						             })]}
						             placeholder="Diagnóstico Presuntivo..."
						             placeholderTextColor="#b7b7b7"
						             underlineColorAndroid="transparent"
						             autoCapitalize="sentences"
						             multiline={true}
						             numberOfLines={4}
						             textAlign={I18nManager.isRTL ? 'right' : 'left'}
						             editable={true}
						             keyboardType="default"/>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Tratamiento Aplicado en la Consulta:
							  </Text>
						  </View>
						  <TextInput onChangeText={(text) => this.setState({applied_treatment: text})}
						             onBlur={() => this.removeFromErrors('applied_treatment')}
						             value={this.state.applied_treatment}
						             style={[styles.textArea, this.state.errors.map((k) => {
							             if (k === 'applied_treatment') {
								             return styles.textAreaError;
							             }
						             })]}
						             placeholder="Tratamiento Aplicado en la Consulta..."
						             placeholderTextColor="#b7b7b7"
						             underlineColorAndroid="transparent"
						             autoCapitalize="sentences"
						             multiline={true}
						             numberOfLines={4}
						             textAlign={I18nManager.isRTL ? 'right' : 'left'}
						             editable={true}
						             keyboardType="default"/>

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Indicaciones para el Propietario:
							  </Text>
						  </View>
						  <TextInput onChangeText={(text) => this.setState({indications: text})}
						             onBlur={() => this.removeFromErrors('indications')}
						             value={this.state.indications}
						             style={[styles.textArea, this.state.errors.map((k) => {
							             if (k === 'indications') {
								             return styles.textAreaError;
							             }
						             })]}
						             placeholder="Indicaciones para el Propietario..."
						             placeholderTextColor="#b7b7b7"
						             underlineColorAndroid="transparent"
						             autoCapitalize="sentences"
						             multiline={true}
						             numberOfLines={4}
						             textAlign={I18nManager.isRTL ? 'right' : 'left'}
						             editable={true}
						             keyboardType="default"/>

						  <View style={{height:50}}></View>
						  {this.state.clinicHistory.images
						  && this.state.clinicHistory.images.length ?
						 <View>
							 <Text style={{textAlign: "center", color:"#ffffff", fontSize:22}}>Fotos previamente guardadas:</Text>
							<Grid style={AppStyles.forms.addRowCard}>
								<Row>
									{this.state.clinicHistory.images.map((image, index) => {
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
						</View>
							:
							null
						  }

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Fotos del animal (Opcional):
							  </Text>
						  </View>
						  <View style={{height: 10}}/>
						  
						  <Grid style={AppStyles.forms.addRowCard}>
							  {/*<TouchableOpacity onPress={()=> this.addImage()}>
                                    <Image style={styles.profileImage}
                                           source={this.state.avatarSource || {uri: 'http://api.meemo.vet/assets/uploads/users/1.png'}}/>
                                </TouchableOpacity>*/}
							  <Row>
								  {this.state.images.map(image => {
									  return (
										<Col>
											<Image style={[styles.profileImage, {
												borderRadius: 0,
												zIndex: 1,
											}]}
											       source={image.avatarSource}/>
											<TouchableOpacity
											  onPress={() => this.removeImage()}
											  style={[AppStyles.forms.addRowCardButton, {
												  transform: [
													  {rotate: '45deg'},
													  {scaleX: 0.85},
													  {scaleY: 0.85},
												  ],
												  position: 'absolute',
												  top: 0,
												  left: 0,
												  zIndex: 100,
											  }]}>
												<Ionicons name="md-add" size={32}
												          style={AppStyles.forms.addRowCardButtonIcon}/>
											</TouchableOpacity>
										</Col>
									  )
								  })}
								  <Col>
									  <TouchableOpacity
										onPress={() => this.addImage()}
										style={[AppStyles.forms.addRowCardButton, {
											zIndex: 200,
											marginLeft: this.state.images.length ? 5 : 0,
										}]}>
										  <Ionicons name="md-add" size={32}
										            style={AppStyles.forms.addRowCardButtonIcon}/>
									  </TouchableOpacity>
								  </Col>
							  </Row>
						  </Grid>
					  </View>

					  <View>
						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Desparasitación Interna:
							  </Text>
						  </View>

						  <TouchableOpacity onPress={() => this.checkboxCheck()} style={styles.chboxConatiner}>
							  <CheckBox
								style={styles.chboxRemember}
								onClick={() => this.checkboxCheck()}
								isChecked={this.state.deworming}
								checkedImage={
									<MaterialIcons
									  name="check-box"
									  size={25}
									  color="#FFF"
									/>
								}
								unCheckedImage={
									<MaterialIcons
									  name="check-box-outline-blank"
									  size={25}
									  color="#FFF"
									/>
								}
							  />

							  <Text style={styles.textRememberMe}>
								  Desparasitación Aplicada
							  </Text>
						  </TouchableOpacity>
					  </View>
					  {this.state.vax_names
					  && this.state.vax_names.length ?
					  <Text style={{textAlign: "center", color:"#ffffff", fontSize:22}}>
								  Vacunas Guardadas:
					  </Text>
					  : null }
						  {this.state.vax_names
						  && this.state.vax_names.length ?
						  
						    this.state.vax_names.map(vaccine => {
							    return (
									<View style={styles.tandc}>
										<Text style={{textAlign: "center", color:"#dddddd", fontSize:16}}>{vaccine}</Text>
									</View>
							    )
						    })
						    :
						    null
						  }

					  <View>
						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Vacunas:
							  </Text>
						  </View>
						  <TouchableOpacity onPress={() => this.checkboxVaccineCheck()} style={styles.chboxConatiner}>
							  <CheckBox
								style={styles.chboxRemember}
								onClick={() => this.checkboxVaccineCheck()}
								isChecked={this.state.hasVaccines}
								checkedImage={
									<MaterialIcons
									  name="check-box"
									  size={25}
									  color="#FFF"
									/>
								}
								unCheckedImage={
									<MaterialIcons
									  name="check-box-outline-blank"
									  size={25}
									  color="#FFF"
									/>
								}
							  />
							  <Text style={styles.textRememberMe}>
								  Vacunación Aplicada
							  </Text>
						  </TouchableOpacity>
					  </View>

					  {this.state.hasVaccines ? 
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
						items={this.state.vaccinesData}
						uniqueKey="id"
						ref={(component) => {
							this.multiSelect = component
						}}
						onSelectedItemsChange={this.onSelectedItemsChange}
						selectedItems={this.state.selectedItems}
						selectText="Elige las vacuanas aplicadas"
						searchInputPlaceholderText="Buscar Vacunas..."
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
						submitButtonText="Aceptar"
						onToggleList={() => this.onToggleList()}
						onAddItem={() => console.log('onAddItem')}
						onClearSelector={() => this.onClearSelector()}
					  />
					  </View>
					   : null}

{this.state.clinicHistory.controls
						  && this.state.clinicHistory.controls.length ?
						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Próximas visitas programadas:
							  </Text>
						  </View> : null }
						  {this.state.clinicHistory.controls
						  && this.state.clinicHistory.controls.length ?
							this.state.clinicHistory.controls.map(control => {
								return (
								  <View>
									  <View style={styles.tandc}>
										  <Text style={{textAlign: "center", color:"#dddddd", fontSize:16}}>Fecha: {parseEventDate(control.date)}{"\n"}Razon: {control.reason}</Text>
									  </View>
								  </View>
								)
							})
							:
							null
						  }

						  <View style={styles.tandc}>
							  <Text style={styles.separatorText}>
								  Próxima Visita (Opcional):
							  </Text>
						  </View>
						  <Grid style={AppStyles.forms.addRowCard}>
							  {this.state.controls.length ?
								this.renderControls()
								: null}
							  <Row>
								  <Col>
									  <TouchableOpacity
										onPress={() => this.toggleSortModal(true)}
										style={AppStyles.forms.addRowCardButton}>
										  <Ionicons name="md-add" size={32}
										            style={AppStyles.forms.addRowCardButtonIcon}/>
									  </TouchableOpacity>
								  </Col>
							  </Row>
						  </Grid>

					  <View>
						  <TouchableOpacity style={styles.buttonSignIn} onPress={() => this.save()}>
							  <Text style={styles.signInText}>Guardar Consulta</Text>
						  </TouchableOpacity>
					  </View>

					  <View>
						  <TouchableOpacity style={styles.buttonSignIn} onPress={() => this.send()}>
							  <Text style={styles.signInText}>Finalizar Consulta</Text>
						  </TouchableOpacity>
					  </View>
				  </KeyboardAwareScrollView>
			  </Content>


			  <Modal
				style={addressStyles.modalView}
				transparent={true}
				visible={this.state.modalForControls}
				onRequestClose={() => this.setState({
					modalForControls: false
				})}>
				  <View style={addressStyles.model}>
					  <View style={addressStyles.modell}>
						  <View style={addressStyles.modalHeader}>
							  <TouchableOpacity
								onPress={() => {
									this.setState({modalForControls: false});
								}}>
								  <Text style={addressStyles.cancelApplyTxt}>Cancelar</Text>
							  </TouchableOpacity>

							  {/*<Text style={addressStyles.cancelApplyTxttt}>Control</Text>*/}

							  <TouchableOpacity
								onPress={() => this.pushControl()}>
								  <Text style={addressStyles.cancelApplyTxtt}>Guardar</Text>
							  </TouchableOpacity>
						  </View>

						  <View style={addressStyles.floatingView}>

							  <DatePicker
								style={AppStyles.forms.datePicker}
								date={this.state.date}
								mode="date"
								placeholder="Fecha del próximo control"
								format="DD-MM-YYYY"
								minDate={new Date()}
								/*
								maxDate="2016-06-01"*/
								confirmBtnText="Confirmar"
								cancelBtnText="Cancelar"
								customStyles={AppStyles.forms.datePicker.customStyles}
								onDateChange={(date) => {
									const dates = date.split('-');
									const parsedDate = dates[2] + '-' + dates[1] + '-' + dates[0] + 'T12:00:00Z';
									this.setState({
										date,
										controlParsedDate: parsedDate
									})
								}}
							  />

							  <View style={{height: 10}}/>
							  <FloatingLabelInput
								label="Motivo del Control"
								value={this.state.controlReason}
								keyboardType="default"
								returnKeyType="done"
								maxLength={30}
								selectionColor={'#959595'}
								autoCapitalize="sentences"
								onChangeText={controlReason => this.setState({controlReason})}
							  />

						  </View>
					  </View>
				  </View>
			  </Modal>


			  <RNModal
				style={AppStyles.modal.wrapper}
				isVisible={this.state.doneModalVisible}
				onBackdropPress={() => this._hideModal()}
			  >
				  <View style={AppStyles.modal.container}>
					  <Image source={Images.delivery_boy} style={AppStyles.modal.mainImage}/>

					  <Text style={AppStyles.modal.title}>¡Gracias por usar Meemo!</Text>

					  <Text style={AppStyles.modal.subtitle}>Recuerde que sus honorarios se acreditarán en su cuenta de
						  MercadoPago.</Text>

					  <TouchableOpacity
						style={AppStyles.modal.primaryButton}
						onPress={() => this._hideModal()}
					  >
						  <Text style={AppStyles.modal.primaryButtonText}>Aceptar</Text>
					  </TouchableOpacity>
				  </View>
			  </RNModal>
			  {this.state.clinicHistory.images
			  && this.state.clinicHistory.images.length ?
			    <ImageView
				  images={this.state.clinicHistory.images}
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
