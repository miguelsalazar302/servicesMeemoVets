
import React, { PropTypes, Component } from 'react';
import { Text, View, Platform, Dimensions, Image, TextInput, TouchableOpacity, ImageBackground, BackHandler,I18nManager} from 'react-native';
import { Container, Content, Button, Icon, Right, Item, Input, Header, Left, Body, Title} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// Screen Styles
import styles from './styles';

export default class SignIn_05 extends Component {

	componentWillMount() {
	  var that = this
	  BackHandler.addEventListener('hardwareBackPress', function() {
			that.props.navigation.navigate('Home')
	   	return true;
	  });
	}

	render() {
    const imageUri = "https://antiqueruby.aliansoftware.net/Images/signin/image_bg_signin_five.jpg";
		const imageMountifyLogo = "https://antiqueruby.aliansoftware.net/Images/signin/ic_logo_mountify_signin_eight.png";
		return (
			<Container>
				<ImageBackground style={styles.imgContainer} source={{uri:imageUri}}>
					<Header style={styles.header}>
						<Left style={styles.left}>
							<TouchableOpacity style={styles.backArrow} onPress={()=>this.props.navigation.navigate('Home')}>
						 		<FontAwesome name={I18nManager.isRTL ? "angle-right" : "angle-left"} size={30} color="#fff"/>
							</TouchableOpacity>
						</Left>
						<Body style={styles.body}>
							<Text style={styles.textTitle}>Sign In</Text>
						</Body>
						<Right style={styles.right}/>
					</Header>

					<Content>
							<View style={styles.logoSec}>
								<Image style={styles.imageLogoMountify} source={{uri:imageMountifyLogo}}/>
							</View>
							<TextInput style={styles.textInput}
								placeholder = "Email"
								placeholderTextColor = "#b7b7b7"
								underlineColorAndroid = "transparent"
								autoCapitalize = "none"
								textAlign={I18nManager.isRTL ? 'right' : 'left'}
								keyboardType = "email-address"/>

							<TextInput style={styles.textInput}
								secureTextEntry = {true}
								placeholder = "Contraseña"
								placeholderTextColor = "#b7b7b7"
								underlineColorAndroid = "transparent"
								autoCapitalize = "none"
								textAlign={I18nManager.isRTL ? 'right' : 'left'}
								keyboardType = "default"/>

							<TouchableOpacity style = {styles.buttonSignIn} onPress = {() => alert('Sign In')}>
						 		<Text style = {styles.signInText}>Sign In</Text>
							</TouchableOpacity>

					</Content>

					<Text style={styles.textForgotPsssword} onPress = {() => alert('Forgot Password')}>Forgot your password?</Text>

					<View style={styles.signInWithFbBg}>
						<FontAwesome name="facebook" size={28} color="#ffffff" />
						<Text style={styles.signInWithFbText} onPress = {() => alert('Facebook')}>Sign in with facebook</Text>
					</View>

				</ImageBackground>
			</Container>
		);
	}
}
