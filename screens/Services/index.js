import React, {Component} from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import {
    Container,
    Icon,
    Right,
    Header,
    Left,
    Body,
    Content
} from "native-base";
import styles from './styles.js';
import {Images} from "../../Themes";
// IMAGES
import LogoMeemo from './../../assets/images/logomeemoverde.fw.png';
import AuthService from "../../modules/AuthService";

export default class Services extends Component {

    static navigationOptions = {
        header: null,
        headerMode: 'none'
    };

    constructor(props) {
        super(props);

        this.state = {
            data: [
                {
                    id: 1,
                    title: 'Veterinarios',
                    itemImg: Images.ic_details,
                },
                {
                    id: 2,
                    title: 'Alimento',
                    itemImg: Images.ic_order,
                },
                {
                    id: 3,
                    title: 'Juguetes',
                    itemImg: Images.ic_address,
                },
                {
                    id: 4,
                    title: 'Grooming',
                    notification: '3',
                    itemImg: Images.ic_notification,
                },
                {
                    id: 5,
                    title: 'Paseadores',
                    itemImg: Images.ic_get_reward,
                },
                {
                    id: 6,
                    title: 'Alojamiento',
                    itemImg: Images.ic_logout,
                },
            ]
        };

        this.auth = new AuthService();
    }

    setServiceView() {
        this.auth.isGuestUser().then(boolean => {
            if(boolean) {
                this.props.navigation.navigate('Register');
            } else {
                this.props.setContent('VetList')
            }
        }).catch(err => console.log(err));
    }

    item({ item }) {
        return (
            <TouchableOpacity
                style={styles.rowMain}
                onPress={() => this.setServiceView()}>
                <View style={styles.imageContainer}>
                    <Image source={item.itemImg} style={styles.itemImgStyle} />
                    {/*{rowData.notification ? (
                    <View style={styles.notificationCircle}>
                        <Text style={styles.notification}>3</Text>
                    </View>
                ) : null}*/}
                </View>
                <Text style={styles.itemText}>{item.title}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <Container>
                <Header style={styles.header} androidStatusBarColor={"#0e1130"}>
                    <Left style={styles.left}>
                        <TouchableOpacity
                            style={styles.backArrow}
                            onPress={() => this.props.openDrawer()}
                        >
                            <Icon name="ios-menu" style={styles.iconColor} />
                        </TouchableOpacity>
                    </Left>

                    <Body style={styles.body}>
                    <Image
                        source={LogoMeemo}
                        style={{ flex: 0.3, resizeMode: "contain" }}
                    />
                    </Body>

                    <Right style={styles.right}></Right>
                </Header>
                <Content style={styles.container}>
                    <FlatList
                        contentContainerStyle={styles.content}
                        data={this.state.data}
                        renderItem={this.item.bind(this)}
                        keyExtractor={item => item.id}
                    />
                </Content>
            </Container>
        );
    }
}