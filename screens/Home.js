import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
    BackHandler,
    I18nManager, Alert, StatusBar
} from "react-native";
import {
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
    Title
} from "native-base";
const drawerStyles = {
    drawer: {
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 0
    }
};
import Drawer from "react-native-drawer";
import MyControlPanelVet from "./../components/ControlPanelVet/ControlPanelVet";
import tweens from "./../containers/Drawer/DrawerSocialNotification/tweens";
import styles from "./../containers/Drawer/DrawerSocialNotification/styles";

import PendingUser from "./_pendingUser";

// @Smell: Revisar después este "sub Home"
import _home from './_home';
import {EventRegister} from "react-native-event-listeners";
import AuthService from "../modules/AuthService";
import {USER_STATUS_PENDING} from "../models/constants";
import Services from "./Services/index";
import MyAppointments from "./MyAppointments/MyAppointments";
import Loading from "../components/loading";
import MyPetOwners from "./MyPetOwners/MyPetOwners";

export default class Home extends Component {

    static navigationOptions = {
        header: null,
        headerMode: 'none'
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: true,
            drawerType: "static",
            openDrawerOffset: 50,
            closedDrawerOffset: 0,
            panOpenMask: 0.1,
            relativeDrag: false,
            panThreshold: 0.25,
            tweenHandlerOn: false,
            tweenDuration: 350,
            tweenEasing: "linear",
            disabled: false,
            tweenHandlerPreset: null,
            acceptDoubleTap: false,
            acceptTap: false,
            acceptPan: true,
            tapToClose: true,
            negotiatePan: false,
            side: "left",
            content: 'Home'
        };

        this.setContent = this.setContent.bind(this);

        this.auth = new AuthService();
    }
    componentWillMount() {
        /*setTimeout(() => {
            this.drawer.open();
        }, 1000);*/
    }
    setDrawerType(type) {
        this.setState({
            drawerType: type
        });
    }

    tweenHandler(ratio) {
        if (!this.state.tweenHandlerPreset) {
            return {};
        }
        return tweens[this.state.tweenHandlerPreset](ratio);
    }

    noopChange() {
        this.setState({
            changeVal: Math.random()
        });
    }

    openDrawer() {
        this.drawer.open();
    }

    setStateFrag(frag) {
        this.setState(frag);
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

    hideLoading() {
        this.setState({
            loading: false
        });
    }

    load() {
        this.auth.isGuestUser().then(boolean => {
            if (!boolean) {
                console.log('load');
                this.auth.getRemoteUserData()
                    .then((res) => {
                        console.log(res);
                        this.setState({
                            userStatus: res.data.status
                        });
                        this.hideLoading();
                    }).catch(err => {
                    Alert.alert('Error', err.message);
                    this.hideLoading();
                });
            } else {
                console.log('load not');
                this.hideLoading();
            }
        }).catch(err => {
            console.log(err);
            this.hideLoading();
        });
    }

    setContent(page) {
        this.setState({
            content: page
        });
    }

    renderContent() {
        if (this.state.content === 'Home') {
            return (<_home setContent={this.setContent}
                           navigation={this.props.navigation}
                           openDrawer={() => this.openDrawer()}/>);
        }
        if (this.state.content === 'Services') {
            return (<Services setContent={this.setContent}
                              navigation={this.props.navigation}
                              openDrawer={() => this.openDrawer()}/>);
        }
        if (this.state.content === 'MyPetOwners') {
            return (<MyPetOwners setContent={this.setContent}
                                navigation={this.props.navigation}
                                openDrawer={() => this.openDrawer()}/>);
        }
        if (this.state.content === 'MyAppointments') {
            return (<MyAppointments setContent={this.setContent}
                                    navigation={this.props.navigation}
                                    openDrawer={() => this.openDrawer()}/>);
        }
    }

    goToChat(chatId) {
		this.props.navigation.navigate('FreeChat', {chatId});
	}

    render() {
        StatusBar.setHidden(true);
        const controlPanel = (
                <MyControlPanelVet
                    navigation={this.props.navigation}
                    setContent={this.setContent}
                    closeDrawer={() => {
                        this.drawer.close();
                }}
            />
        );
        return (
            this.state.loading ? <Loading/> :
            this.state.userStatus === USER_STATUS_PENDING ?
                <PendingUser />
                :
            <View style={styles.container}>
                <Drawer
                    ref={c => (this.drawer = c)}
                    type={this.state.drawerType}
                    animation={this.state.animation}
                    openDrawerOffset={this.state.openDrawerOffset}
                    closedDrawerOffset={this.state.closedDrawerOffset}
                    panOpenMask={this.state.panOpenMask}
                    panCloseMask={this.state.panCloseMask}
                    relativeDrag={this.state.relativeDrag}
                    panThreshold={this.state.panThreshold}
                    content={controlPanel}
                    styles={drawerStyles}
                    disabled={this.state.disabled}
                    tweenHandler={this.tweenHandler.bind(this)}
                    tweenDuration={this.state.tweenDuration}
                    tweenEasing={this.state.tweenEasing}
                    acceptDoubleTap={this.state.acceptDoubleTap}
                    acceptTap={this.state.acceptTap}
                    acceptPan={this.state.acceptPan}
                    tapToClose={this.state.tapToClose}
                    negotiatePan={this.state.negotiatePan}
                    changeVal={this.state.changeVal}
                    side={this.state.side}
                >
                    {this.renderContent()}
                </Drawer>
            </View>
        );
    }
}
