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
import styles from './../containers/ECommerce/InviteFriends/styles';
import { Images, Fonts, Metrics, Colors } from '../Themes';

const inviteImg =
    'https://antiqueruby.aliansoftware.net/Images/woocommerce/inviteFriendsLogo.png';

export default class PendingUser extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            return false;
        });
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
                    </Left>
                    <Body style={styles.body}>
                    <Text style={styles.textTitle}>Pendiente de revisión</Text>
                    </Body>
                    <Right style={styles.right} transparent />
                </Header>

                <View style={styles.content}>
                    <Image source={{ uri: inviteImg }} style={styles.imageLogo} />
                    <Text style={styles.invitationCodeTxt}>Su cuenta está siendo revisada</Text>
                    <Text style={styles.codeTxt}>Espere novedades en su correo electrónico para empezar a usar Meemo</Text>
                </View>
            </Container>
        );
    }
}
