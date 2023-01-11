import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    StatusBar,
    Platform,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    BackHandler,
    I18nManager
} from 'react-native';
import {Container, Button, Icon, Right, Header, Left, Body} from 'native-base';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Screen Styles
import styles from './../containers/Walkthrough/styles';

import swiperImage from './../assets/images/walkthrough.png';

import LogoMeemo from './../assets/images/logo-meemo-white.png';
import IsologoMeemo from './../assets/images/isologo-meemo-white.png';

// Walkthrough Images
import Map from './../assets/images/walkthrough-vet/01.png';
import Agenda from './../assets/images/walkthrough-vet/02.png';
import Coins from './../assets/images/walkthrough-vet/03.png';
import Doctor from './../assets/images/walkthrough-vet/04.png';

export default class WalkthroughScreenVet extends Component {
    static navigationOptions = {
        header: null
    };


    constructor(props) {
        super(props);
        this.state = {
            index: 0
        };
    }

    componentWillMount() {
        var that = this;
        BackHandler.addEventListener('hardwareBackPress', function () {
            // that.props.navigation.navigate('Walkthrough');
            return true;
        });
    }

    swipePages = (dataLength) => {
        if (this.state.index === dataLength) {
            this.setState({index: 0})
        }
        this.refs.swiper.scrollBy(1)
    };

    goToLogin() {
        this.props.navigation.navigate('Main');
    }

    checkIfSwiperEndsAndRedirect(dataLength) {
        const currentIndex = this.state.index;
        if (currentIndex === (dataLength - 1)) {
            this.goToLogin();
        }
    }

    render() {
        StatusBar.setBarStyle('light-content', true);
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor('rgba(0,0,0,0.3)', true);
            StatusBar.setTranslucent(true);
        }

        var renderPagination = function (index, total) {
            return <View style={{}}><Text>{index}/{total}</Text></View>
        };

        const data = [
            {
                id: 1,
                topImage: IsologoMeemo,
                image: Map,
                title: '¡Tu Zona!',
                description: 'Deberás definir el área en que atenderás tus consultas. Esto es importante para limitar donde estarás disponible para la atención a domicilio.',
            },
            {
                id: 2,
                topImage: IsologoMeemo,
                image: Agenda,
                title: '¡Tu Agenda!',
                description: 'Deberás establecer tus días y horarios de atención y comprometerte a mantener tu disponibilidad para que te encuentren y contraten cuando vos quieras.',
            },
            {
                id: 3,
                topImage: IsologoMeemo,
                image: Coins,
                title: '¡Tus Tarifas!',
                description: 'Deberás establecer tus tarifas para brindar servicios en horarios normales. Opcionalmente podrás establecer tarifas especiales para días y horas fuera de tus horarios normales. Sólo será necesario que tengas una cuenta de MercadoPago para empezar a cobrar.',
            },
            {
                id: 4,
                topImage: IsologoMeemo,
                image: Doctor,
                title: '¡Brindá el Mejor Servicio!',
                description: 'Los clientes valoran mucho tu esmero y la buena atención. Respondé las consultas que te hagan y cumplí las pautas que fijaste para brindar tu servicio. Un cliente satisfecho te volverá a contratar!',
            },
        ];

        return (
            <Container>
                <LinearGradient locations={[0.15, 1]} colors={['#51CBBF', '#149e90']} style={styles.shadowBg}>
                    <Header style={styles.header}>
                        <Left style={styles.left}>
                        </Left>
                        <Body style={styles.body}>
                        </Body>
                        <Right style={styles.right}/>
                    </Header>

                    <Swiper showsButtons={false}
                            autoplay={false}
                            loop={false}
                            ref="swiper"
                            index={this.state.index}
                        /*activeDot={<View style={styles.activeDot}/>}
                        dot={<View style={styles.dot}/>}*/
                            activeDot={<View/>}
                            dot={<View/>}
                            onIndexChanged={(index) => {
                                this.setState({index})
                            }}>
                        {
                            data.map((item, index) => {
                                return (
                                    <View style={styles.slide} key={index}>
                                        {item.topImage
                                            ? <Image source={item.topImage} style={styles.sliderTopImage}/>
                                            : null}
                                        {item.title
                                            ? <Text style={styles.headertext}>
                                                {item.title}
                                            </Text>
                                            : null}
                                        <Image source={item.image} style={styles.sliderImage}/>
                                        <Text style={styles.desctext}>
                                            {item.description}
                                        </Text>
                                    </View>
                                )
                            })
                        }
                    </Swiper>

                    <View style={styles.btnsec}>
                        <Button rounded onPress={() => {
                            this.swipePages(data.length);
                            this.checkIfSwiperEndsAndRedirect(data.length);
                        }} style={styles.nextBotton}>
                            <Text style={styles.nextText}>Siguiente</Text>
                        </Button>
                        <Right>
                            {/*<TouchableOpacity onPress={() => this.goToLogin()}>
                                <Text style={styles.skipText}>Saltear</Text>
                            </TouchableOpacity>*/}
                        </Right>
                    </View>
                </LinearGradient>
            </Container>

        );
    }
}
