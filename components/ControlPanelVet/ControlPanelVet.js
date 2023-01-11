import React, {Component} from "react";
import {
	View,
	Text,
	TouchableOpacity,
	ImageBackground,
	Image, Alert
} from "react-native";
import {EventRegister} from 'react-native-event-listeners';
import {Container, Header, Content, Item, Input, Icon} from "native-base";
import styles from "./styles";
import AuthService from "../../modules/AuthService";

import VersionNumber from 'react-native-version-number';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";


export default class ControlPanelVet extends Component {

	constructor() {
		super();

		this.state = {
			full_profile_image: '',
			name: ''
		};

		this.auth = new AuthService();
	}

	componentDidMount() {
		this.load();
	}

	componentWillMount() {
		this.listener = EventRegister.addEventListener('reload', (data) => {
			this.load();
		})
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.listener)
	}

	load() {
		this.auth.isGuestUser().then(boolean => {
			if (!boolean) {
				console.log('load');
				this.auth.getRemoteUserData()
				  .then((res) => {
					  this.setState({
						  full_profile_image: res.data.full_profile_image + '?cache=' + new Date().getTime(),
						  name: res.data.name
					  })
				  }).catch(err => {
					Alert.alert('Error', err.message);
				});
			} else {
				console.log('load not');
			}
		}).catch(err => {
			console.log(err);
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
					  this.props.closeDrawer();
					  this.auth.logout();
					  this.props.navigation.navigate('Login');
				  }
			  },
		  ],
		  {cancelable: false},
		);
	}

	goToConfiguration() {
		this.props.closeDrawer();
		this.props.navigation.navigate('Configuration');
	}

	goToHome() {
		this.customCloseDrawerAndSetContent('Home');
	}

	goToMyProfile() {
		this.props.closeDrawer();
		this.auth.isGuestUser().then(boolean => {
			if (boolean) {
				this.props.navigation.navigate('Register');
			} else {
				this.props.navigation.navigate('MyProfileVet');
			}
		}).catch(err => console.log(err));
	}

	customCloseDrawerAndSetContent(content) {
		this.props.closeDrawer();
		setTimeout(() => this.props.setContent(content), 500);
	}

	showMyAppointments() {
		this.customCloseDrawerAndSetContent('MyAppointments');
	}

	showMyPetOwners() {
		this.customCloseDrawerAndSetContent('MyPetOwners');
	}

	showChatList() {
		this.props.navigation.navigate('Chatlist');
	}

	render() {
		// this.load();
		/*const profileImgUri =
		  "https://antiqueruby.aliansoftware.net//Images/social/ic_msg_user01_s21_29.jpg";*/
		return (
		  <Container style={styles.menuContainer}>
			  <TouchableOpacity onPress={() => this.goToMyProfile()}>
				  <View style={styles.userProfiles}>
					  <View style={styles.userProfilestyleSec}>
						  {/*<TouchableOpacity onPress={() => alert("Notification")}>
                  <FontAwesome name="bell" size={14} color="#595b6a" />
                </TouchableOpacity>*/}
						  <Image
							source={{uri: this.state.full_profile_image}}
							style={styles.userImageStyle}
						  />
						  {/*<TouchableOpacity onPress={() => alert("Settings")}>
                  <SimpleLineIcons name="settings" color="#595b6a" size={14} />
                </TouchableOpacity>*/}
					  </View>
					  <View style={styles.userProfilestyleSec}>
						  <Text style={styles.userDetailsText}>{this.state.name || 'Bienvenido'}</Text>
						  {/*<Text style={styles.userDetailsText}>Seattle, USA</Text>*/}
					  </View>
				  </View>
			  </TouchableOpacity>
			  <Content style={styles.menucontrolPanel}>
				  <View style={styles.menumainview}>
					  <TouchableOpacity onPress={() => this.goToHome()}>
						  <View style={styles.listrow}>
						      <SimpleLineIcons name="home" color="#ffffff" size={14} style={styles.rowtxt} />
							  <Text style={styles.rowtxt}>Inicio</Text>
						  </View>
					  </TouchableOpacity>

					  <TouchableOpacity onPress={() => this.goToConfiguration()}>
						  <View style={styles.listrow}>
						  	  <SimpleLineIcons name="settings" color="#ffffff" size={14} style={styles.rowtxt} />
							  <Text style={styles.rowtxt}>Configuración</Text>
						  </View>
					  </TouchableOpacity>

					  <TouchableOpacity onPress={() => this.showMyPetOwners()}>
						  <View style={styles.listrow}>
						      <SimpleLineIcons name="people" color="#ffffff" size={14} style={styles.rowtxt} />
							  <Text style={styles.rowtxt}>Clientes</Text>
						  </View>
					  </TouchableOpacity>

					  <TouchableOpacity onPress={() => this.showMyAppointments()}>
						  <View style={styles.listrow}>
						      <SimpleLineIcons name="book-open" color="#ffffff" size={14} style={styles.rowtxt} />
							  <Text style={styles.rowtxt}>Servicios</Text>
							  {/*<View style={[styles.notiCountSec, styles.notiCountSecBlue]}>
                          <Text style={styles.notiCount}>2</Text>
                      </View>*/}
						  </View>
					  </TouchableOpacity>

					  <TouchableOpacity onPress={() => this.showChatList()}>
						  <View style={styles.listrow}>
						      <SimpleLineIcons name="speech" color="#ffffff" size={14} style={styles.rowtxt} />
							  <Text style={styles.rowtxt}>Chats</Text>
						  </View>
					  </TouchableOpacity>


					  {/*<TouchableOpacity onPress={() => alert("Invita a un amigo")}>
              <View style={styles.listrow}>
                <Text style={styles.rowtxt}>Invita a un amigo</Text>
              </View>
            </TouchableOpacity>*/}
				  </View>
			  </Content>

			  {/*<TouchableOpacity
            onPress={() => alert("Urgencias")}
            style={styles.menumainview}
        >
            <View style={styles.emergencyWrapper}>
                <Text style={styles.emergencyText}>Mis Urgencias</Text>
            </View>
        </TouchableOpacity>*/}
			  <TouchableOpacity
				onPress={() => this.logout()}
				style={styles.menumainview}
			  >
				  <View style={styles.listrow}>
					  <Text style={styles.rowtxt}>Cerrar Sesión</Text>
				  </View>
			  </TouchableOpacity>
			  <View style={styles.menumainview}>
				  <View style={styles.listrow}>
					  <Text style={styles.versiontxt}>v{VersionNumber.appVersion}</Text>
				  </View>
			  </View>
		  </Container>
		);
	}
}
