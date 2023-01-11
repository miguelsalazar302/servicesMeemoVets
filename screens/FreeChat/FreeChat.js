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
// import {CachedImage} from "react-native-cached-image";
import moment from "moment";

import AppStyles from './../../Themes/ApplicationStyles';

import {GiftedChat, Send} from 'react-native-gifted-chat'


// IMAGES
import LogoMeemo from './../../assets/images/logomeemoverde.fw.png';
import APIService from "../../modules/ApiService";
import {wording} from "../../models/wording";
import Helpers from "../../modules/Helpers";
import AuthService from "../../modules/AuthService";

const interval = 3000;


export default class Freechat extends Component {

	static navigationOptions = {
		header: null,
		headerMode: 'none'
	};

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			chatId: this.props.navigation.getParam('chatId', 0),
			messages: [],
			userId: 0,
		};

		this.api = new APIService();
		this.helpers = new Helpers();
		this.auth = new AuthService();
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

	componentWillMount() {
		BackHandler.addEventListener("hardwareBackPress", function () {
			return true;
		});
	}

	componentDidMount() {
		this.load();
	}

	componentWillUnmount() {
		this.unload();
	}

	getMessages() {
		this.auth.getLocalUserData().then(res => {
			this.setState({
				  userId: res.id
			  }, () => {
				  this.api.getFreeMessages(this.state.chatId).then(res => {
					  const messages = res.data.map(msg => {
						  return {
							  _id: msg.id,
							  text: msg.msg,
							  // createdAt: new Date(msg.created_at),
							  createdAt: new Date(moment(msg.created_at, "YYYY-MM-DDThh:mm:ssZ")),
							  system: msg.system || false,
							  image: msg.image || '',
							  user: {
								  _id: msg.user_id,
								  name: msg.name + ' ' + msg.lastname,
								  avatar: msg.full_profile_image,
							  }
						  };
					  });
					  this.setState({
						  messages
					  });
					  this.hideLoading();
				  }).catch(err => {
					  console.log(JSON.stringify(err))
					  // Alert.alert(wording.global.errorTitle, this.helpers.getErrorMsg(err));
					  this.setState({
						  messages: [
							  {
								  _id: 0,
								  text: this.helpers.getErrorMsg(err),
								  // createdAt: new Date(),
								  createdAt: new Date(moment(new Date())),
								  system: true,
							  }
						  ]
					  });
					  console.log(err);
					  this.hideLoading();
				  });
			  }
			);
		}).catch(err => {
			console.log(err);
		});
	}


	load() {
		// this.getMessages(); // DEBUG
		this.listener = setInterval(() => this.getMessages(), interval);
	}

	unload() {
		clearInterval(this.listener);
	}

	onSend(messages = []) {
		console.log(messages);
		if (messages.length && messages[(messages.length - 1)].text) {
			const text = messages[(messages.length - 1)].text;
			/*this.setState(previousState => ({
				messages: GiftedChat.append(previousState.messages, messages),
			}));*/
			this.api.postFreeMessage(text, this.state.chatId, this.state.chatId.toString().slice(0, this.state.chatId.toString().length - this.state.userId.toString().length), this.state.userId).then(res => {
				console.log(res);
				this.getMessages();
			}).catch(err => {
				console.log(err);
			});
		} else {
			console.log('No se encontró el texto del mensaje.');
		}
	}


	render() {

		StatusBar.setBarStyle("light-content", true);

		if (Platform.OS === "android") {
			StatusBar.setBackgroundColor("#0e1130", true);
			StatusBar.setTranslucent(true);
		}

		return (
		  <Container>
			  <Header style={AppStyles.header.main} androidStatusBarColor={"#0e1130"}>
				  <Left style={AppStyles.header.left}>
					  <TouchableOpacity
						style={AppStyles.header.backArrow}
						onPress={() => this.props.navigation.goBack()}
					  >
						  <Icon name="ios-arrow-back" style={AppStyles.menu.hamburguerIcon}/>
					  </TouchableOpacity>
				  </Left>

				  <Body style={AppStyles.header.body}>
				  <Image
					source={LogoMeemo}
					style={{flex: 0.3, resizeMode: "contain"}}
				  />
				  </Body>

				  <Right style={AppStyles.header.right}/>
			  </Header>
			  {
				  this.state.loading
					? <Spinner/>
					: <GiftedChat
					  messages={this.state.messages}
					  onSend={messages => this.onSend(messages)}
					  user={{
						  _id: this.state.userId,
					  }}
					  inverted={false}
					  renderUsernameOnMessage = {true}
					  placeholder="Escribe un mensaje..."
					  locale="es-AR"
					  alwaysShowSend={true}
					  renderSend={(props) => <Send
						{...props}
					  >
						  <Icon style={AppStyles.chat.sendIcon} name="ios-send"/>
					  </Send>}
					/>
			  }
		  </Container>
		);
	}
}
