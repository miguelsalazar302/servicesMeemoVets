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
import Dog from './../assets/images/walkthrough/01.png';
import AnonymousUser from './../assets/images/walkthrough/02.png';
import Pets from './../assets/images/walkthrough/03.png';
import Doctor from './../assets/images/walkthrough-vet/04.png';
import Truck from './../assets/images/walkthrough/04.png';
import Menu from './../assets/images/walkthrough/05.png';

export default class WalkthroughScreen extends Component {
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
        this.props.navigation.navigate('Auth');
    }

    checkIfSwiperEndsAndRedirect(dataLength) {
        const currentIndex = this.state.index;
        if(currentIndex === (dataLength - 1)) {
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
                topImage: LogoMeemo,
                image: Dog,
                title: '',
                description: 'Hola! Ya sos parte de la plataforma mas completa de servicios y productos para tu mascota! Te mostraremos algunas cosas interesantes.',
            },
            {
                id: 2,
                topImage: IsologoMeemo,
                image: AnonymousUser,
                title: '¡Bienvenido!',
                description: 'Podés explorar meemo sin restricciones, pero para poder utilizar nuestros servicios, deberás identificarte. Te tomará sólo unos segundos!',
            },
            {
                id: 3,
                topImage: IsologoMeemo,
                image: Pets,
                title: '¡Ahora ellos!',
                description: 'Para brindarte un mejor un servicio serán necesarios algunos datos de tumascota ¿Tenés más de una? ¡Genial!',
            },
            {
                id: 4,
                topImage: IsologoMeemo,
                image: Doctor,
                title: '¡Es Tuyo!',
                description: 'Sos el propietario del Registro e Historia Clínica Única, donde losprofesionales registrarán todo loreferido a tu mascota. Ahora todo loque le pase, te pertenece!',
            },
            {
                id: 5,
                topImage: IsologoMeemo,
                image: Truck,
                title: '¡Todo Cerca!',
                description: 'Podés rápidamente solicitar urgencias, además de consultas programadas,paseadores, cuidadores y otrosservicios. ¿Y la comida? ¡También!',
            },
            {
                id: 6,
                topImage: IsologoMeemo,
                image: Menu,
                title: '¿Listo?',
                description: 'Podés utilizar las opciones de menú obuscar tu producto o servicio favoritoen la siguiente pantalla.',
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
                            activeDot={<View style={styles.activeDot}/>}
                            dot={<View style={styles.dot}/>}
                            onIndexChanged={(index) => {
                                this.setState({index})
                            }}>
                        {
                            data.map((item, index) => {
                                return (
                                    <View style={styles.slide} key={index}>
                                        {item.topImage
                                            ? <Image source={item.topImage} style={styles.sliderTopImage} />
                                            : null }
                                        {item.title
                                            ? <Text style={styles.headertext}>
                                                {item.title}
                                            </Text>
                                            : null }
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
                            <TouchableOpacity onPress={() => this.goToLogin()}>
                                <Text style={styles.skipText}>Saltear</Text>
                            </TouchableOpacity>
                        </Right>
                    </View>
                </LinearGradient>
            </Container>

        );
    }
}
