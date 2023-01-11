import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	StatusBar,
	TouchableOpacity,
	Platform,
	BackHandler,
	I18nManager,
} from 'react-native';
import {
	Content,
	Container,
	Right,
	Header,
	Left,
	Body,
	Title,
} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import { Images, Fonts, Metrics, Colors } from '../../../Themes/';

const inviteImg =
	'https://antiqueruby.aliansoftware.net/Images/woocommerce/inviteFriendsLogo.png';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillMount() {
		var that = this;
		BackHandler.addEventListener('hardwareBackPress', function() {
			that.props.navigation.navigate('ECommerceMyAccount');
			return true;
		});
	}

	onBackClick() {
		this.props.navigation.navigate('ECommerceMyAccount');
	}

	render() {
		StatusBar.setBarStyle('light-content', true);

		if (Platform.OS === 'android') {
			StatusBar.setBackgroundColor('#0e1130', true);
			StatusBar.setTranslucent(true);
		}

		return (
			<Container style={styles.container}>
				<Header androidStatusBarColor={'#0e1130'} style={styles.header}>
					<Left style={styles.left}>
						<TouchableOpacity
							style={styles.backArrow}
							onPress={this.onBackClick.bind(this)}>
							<FontAwesome
								name={I18nManager.isRTL ? 'angle-right' : 'angle-left'}
								size={30}
								color="white"
								style={{paddingRight: 20}}
							/>
						</TouchableOpacity>
					</Left>
					<Body style={styles.body}>
						<Text style={styles.textTitle}>Invite Friends</Text>
					</Body>
					<Right style={styles.right} transparent />
				</Header>

				<View style={styles.content}>
					<Image source={{ uri: inviteImg }} style={styles.imageLogo} />
					<View style={styles.descriptionTxtBg}>
						<Text
							style={[
								styles.descriptionTxt,
								{
									fontFamily: Fonts.type.helveticaRegular,
									textAlign: 'center',
								},
							]}>
							Receive
							<Text
								style={[
									styles.descriptionTxt,
									{ fontFamily: Fonts.type.sfuiDisplayBold },
								]}>
								{' '}
								RM 100{' '}
							</Text>
							when you share this code with 5 friends!
						</Text>
					</View>
					<Text style={styles.invitationCodeTxt}>Your invitation code</Text>
					<Text style={styles.codeTxt}>1132078</Text>
				</View>

				<View style={styles.bottomView}>
					<TouchableOpacity
						onPress={() => alert('Share with Email')}
						style={[styles.shareWithEmailFbBg, { backgroundColor: '#da403a' }]}>
						<FontAwesome name="envelope" size={15} color="white" />
						<Text style={styles.shareWithEmailFbTxt}>Share with Email</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => alert('Share with Facebook')}
						style={[
							styles.shareWithEmailFbBg,
							{
								backgroundColor: '#3b66c4',
								marginTop: Metrics.WIDTH * 0.02,
								paddingLeft: Metrics.WIDTH * 0.03,
							},
						]}>
						<FontAwesome name="facebook" size={18} color="white" />
						<Text
							style={[
								styles.shareWithEmailFbTxt,
								{ width: Metrics.WIDTH * 0.45 },
							]}>
							Share with Facebook
						</Text>
					</TouchableOpacity>
				</View>
			</Container>
		);
	}
}
