import React, {Component} from 'react';
import {View, FlatList, StyleSheet, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import {
    Container,
    Icon,
    Right,
    Header,
    Left,
    Body,
    Content, 
    Spinner
} from "native-base";
import { BackHandler } from "react-native";
import ApplicationStyles from '../../Themes/ApplicationStyles';
import {Images} from "../../Themes";
import AuthService from "../../modules/AuthService";
import APIService from '../../modules/ApiService.js';
import styles from "./styles";
// IMAGES
import LogoMeemo from './../../assets/images/logomeemoverde.fw.png';

const interval = 3000;

export default class ChatList extends Component {

    static navigationOptions = {
        header: null,
        headerMode: 'none'
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            userId: 0,
            chatlist: [],    
        };

        this.api = new APIService();
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
    
    load() {
		// this.getMessages(); // DEBUG
		this.listener = setInterval(() => this.getAllChats(), interval);
	}

	unload() {
		clearInterval(this.listener);
    }
    
    getAllChats() {
        this.showLoading();
        this.auth.getLocalUserData().then(res => {
            this.setState({
                userId: res.id,
            });
            //console.log(this.state.userId)
            this.api.getChats(this.state.userId).then(response => this.setState({chatlist:response.data}));
        });
        this.hideLoading()
    }

    goToChat(chatId) {
		this.props.navigation.navigate('FreeChat', {chatId});
	}

    render() {
        return (
            <Container>
                <Header style={ApplicationStyles.header.main} androidStatusBarColor={"#0e1130"}>
                    <Left style={ApplicationStyles.header.left}>
					  <TouchableOpacity
						style={ApplicationStyles.header.backArrow}
						onPress={() => this.props.navigation.goBack()}
					  >
						  <Icon name="ios-arrow-back" style={ApplicationStyles.menu.hamburguerIcon}/>
					  </TouchableOpacity>
				    </Left>

                    <Body style={ApplicationStyles.header.body}>
                    <Image
                        source={LogoMeemo}
                        style={{flex: 0.3, resizeMode: "contain"}}
                    />
                    </Body>

                    <Right style={ApplicationStyles.header.right}/>
                </Header>
                <Content>
                {this.state.loading ? <Spinner/> : typeof this.state.chatlist === "string" ? 
                <Text style={{alignContent:"center", alignItems:"center", textAlign:"center", textAlignVertical:"center"}}>{this.state.chatlist}</Text> :                
                this.state.chatlist.map((item, index) => { 
                return(
                    <ScrollView> 
                        <TouchableOpacity style={{flexDirection:"row", paddingTop:10, paddingLeft:20}}
                        onPress={() => this.goToChat(item.chat_id)}>
                            <Image 
                            style={styles.profileImg}
                            source={{uri:item.full_profile_image.replace("http://", "https://")}}
                            />
                            <View style={{flex:2, flexDirection:"column"}}>
                                <Text style={{fontWeight:"bold", flex:1, fontSize:17, paddingLeft:20, paddingTop:10}}>
                                    {item.name.slice(-1) != " " ? 
                                    item.name + " " + item.lastname :
                                     item.name + item.lastname}
                                </Text>
                                <Text style={{flex:1, fontSize:16, paddingLeft:19, paddingBottom:10}}>
                                    {item.msg.length <= 21 ? item.msg : item.msg.slice(0, 18) + "..."}
                                </Text>
                            </View>
                            <View style={{flexDirection:"column", flex:1}}>
                                <Text style={{textAlign:"right", color:"gray", flex:1, paddingRight:20, paddingTop: 10}}>
                                    {new Date().toJSON().slice(0,10).replace(/-/g,'/') !== item.created_at.split("T")[0].replace(/-/g, '/') ? 
                                        item.created_at.split("T")[0].split("-").reverse().join("/").replace("/20", "/") : 
                                        item.created_at.split("T")[1].split(":", 2).join(":")}
                                    </Text>
                                <Text style={{textAlign:"right", color:"gray", flex:1, paddingBottom:5, paddingRight:20}}>Cliente</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{borderBottomColor: 'gray', borderBottomWidth: 1, paddingTop:10}}/> 
                    </ScrollView> )})}
                </Content>
            </Container>
        );
    }
}