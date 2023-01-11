import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    Image,
    StatusBar,
    Platform,
    TouchableOpacity,
    BackHandler,
    I18nManager,
    Alert,
    StyleSheet,
    Dimensions,
    PermissionsAndroid
} from 'react-native';
import { Container,  Icon } from 'native-base';

import Slider from '@react-native-community/slider';

import ApplicationStyles from './../Themes/ApplicationStyles';

import Geolocation from '@react-native-community/geolocation';

import { MAP_CONFIG } from './../models/mapconfig.js'

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Helpers from "../modules/Helpers";

import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import APIService from "../modules/ApiService";
import Loading from "../components/loading";
const { width, height } = Dimensions.get('window');
const mapStyles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: height,
        width: width,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 1,
        paddingBottom: width * 0.1,
        zIndex: 1
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

const latitudeDelta= 0.015;
const longitudeDelta= 0.0121;
const latitude = -34.603572;
const longitude = -58.381402;

const defaultRegion = {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
};
const minimumRangeSlider = 100;

/*const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};*/

const GooglePlacesInput = () => {
    return (
        <GooglePlacesAutocomplete
            placeholder='Buscar por dirección...'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
            listViewDisplayed='auto'    // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                console.log(data, details);
            }}

            getDefaultValue={() => ''}

            query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: 'AIzaSyCt7OM4n-vHlTfXFPmSgI35l55gzmGKMgQ',
                language: 'es', // language of the results
                types: '(cities)' // default: 'geocode'
            }}

            styles={{
                textInputContainer: {
                    width: '100%'
                },
                description: {
                    fontWeight: 'bold'
                },
                predefinedPlacesDescription: {
                    color: '#1faadb'
                },
                container: {
                    height: 1000,
                    zIndex: 2
                }
            }}

            currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch

            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        />
    );
};

export default class MapZoneVet extends Component {

    static navigationOptions =
        ({ navigation }) => (
            {
                headerLeft: <Icon name="arrow-back"
                                  size={30} color='#ffffff'
                                  style={{paddingLeft: 20, color: "#fff"}}
                                  onPress={ () => { navigation.goBack() }} />,
                title: 'Configurar Zona Geográfica',
                headerTitleStyle: {
                    alignSelf: 'center',
                    textAlign: 'center'
                },
            });

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            ms: minimumRangeSlider,
            mapMarginBottom: 1,
            markers: [],
            circles: [],
            region: defaultRegion,
        };

        this.helpers = new Helpers();
        this.api = new APIService();

        this.handlePressForMarkers = this.handlePressForMarkers.bind(this);
        this.handlePressForCircles = this.handlePressForCircles.bind(this);
    }

    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
        });
    };

    componentWillMount() {
        const that = this;
        BackHandler.addEventListener('hardwareBackPress', () => {
            that.props.navigation.navigate('Configuration');
            return true;
        });
    }

    componentDidMount() {
        const defaultValue = undefined;
        const type = this.props.navigation.getParam('type', defaultValue);
        const scheduleId = this.props.navigation.getParam('scheduleId', defaultValue);
        const agenda = this.props.navigation.getParam('agenda', defaultValue);
        const enabled = this.props.navigation.getParam('enabled', defaultValue);

        this.setState({
            type,
            scheduleId,
            agenda,
            enabled
        });

        // Geolocation.getCurrentPosition(info => console.log(info));
    }

    setInitialState() {
        const scheduleId = this.props.navigation.getParam('scheduleId', undefined);
        // const scheduleId = 1; // TODO: REMOVE DEBUG

        if(scheduleId) {
            this.setState({
                loading: true
            });
            this.api.getScheduleById(scheduleId).then(res => {
                console.log(res);
                if(res.data && res.data.location) {
                    this.parseLocationAndSetInitialState(res.data.location);
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }

    parseLocationAndSetInitialState(location) {
        const obj = {
            coordinate: {
                latitude: Number(location.center.lat),
                longitude: Number(location.center.lng),
            },
            radius: Number(location.radius)
        };


        this.setState({
            ms: Number(location.radius),
            loading: false
        }, () => {
        	this.onSliderValueChange(Number(location.radius));
	        this.handlePressForCirclesAndMarkers(obj);
        });
    }

    handlePressForMarkers(e) {
        this.setState({
            // markers: [...this.state.markers,
            markers: [
                {
                    coordinate: e.coordinate
                }
            ],
            region: {
                latitude: e.coordinate.latitude,
                longitude: e.coordinate.longitude,
                latitudeDelta,
                longitudeDelta,
            }
        })
    }

    handlePressForCircles(e) {
        this.setState({
            // markers: [...this.state.markers,
            circles: [
                {
                    center: {
                        latitude: e.coordinate.latitude,
                        longitude: e.coordinate.longitude,
                    },
                    radius: e.radius || 100
                }
            ],
            region: {
                latitude: e.coordinate.latitude,
                longitude: e.coordinate.longitude,
                latitudeDelta,
                longitudeDelta,
            }
        })
    }

    handlePressForCirclesAndMarkers(e) {
        this.setState({
            markers: [
                {
                    coordinate: e.coordinate
                }
            ],
            circles: [
                {
                    center: {
                        latitude: e.coordinate.latitude,
                        longitude: e.coordinate.longitude,
                    },
                    radius: e.radius || 100
                }
            ],
            region: {
                latitude: e.coordinate.latitude,
                longitude: e.coordinate.longitude,
                latitudeDelta,
                longitudeDelta,
            }
        })
    }

    mapRepaint() {
        console.log('mapRepaint');
        this.setState({
            mapMarginBottom: this.state.mapMarginBottom ? 1 : 0
        })
    }

    onSliderValueChange(value) {
        if(!this.state.circles.length) {
            console.log('no circles found!');
            return;
        }
        const circles = JSON.parse(JSON.stringify(this.state.circles));
        circles[0].radius = value;
        this.setState({
            circles,
            ms: value
        });
        this.updateRegionState(value, circles[0].radius);
    }

    updateRegionState(value, radius) {

        let currentRegion = JSON.parse(JSON.stringify(this.state.region));

        // Define the const outside the class
        const { width, height } = Dimensions.get('window');
        const ASPECT_RATIO = width / height;
        // const LATITUDE_DELTA = (Platform.OS === global.platformIOS ? 1.5 : 0.5);
        const LATITUDE_DELTA = (0.0006);
        const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

        // Use the below code to zoom to particular location with radius.
        this.setState({
            region: {
                latitude: currentRegion.latitude,
                longitude: currentRegion.longitude,
                latitudeDelta: LATITUDE_DELTA * Number(radius/15),
                longitudeDelta: LONGITUDE_DELTA * Number(radius/15)
            }
        });
    }

    parseMapDataAndGoToPriceStep() {
        const location = JSON.parse(JSON.stringify(this.state.circles[0]));
        this.props.navigation.navigate('PriceVet', {
            type: this.state.type,
            scheduleId: this.state.scheduleId,
            agenda: this.state.agenda,
            enabled: this.state.enabled,
            location: {
                center: {
                    lat: location.center.latitude,
                    lng: location.center.longitude,
                },
                radius: location.radius
            }
        })

    }

    render(){
        StatusBar.setBarStyle('light-content', true);
        if(Platform.OS === 'android') {
            StatusBar.setBackgroundColor('transparent',true);
            StatusBar.setTranslucent(true);
        }

        return(
            <Container style={{backgroundColor: '#2d324f', flex: 1}}>
                {this.state.loading ? <Loading/> : null}
                <View style={mapStyles.container}>
                    <MapView
                        onMapReady={() => {
                            const scheduleId = this.props.navigation.getParam('scheduleId', undefined);
                            if(scheduleId) {
                                this.setInitialState();
                                return;
                            }
                            PermissionsAndroid.request(
                                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                            ).then(granted => {
                                console.log(granted); // just to ensure that permissions were granted
                                this.getCurrentLocation().then(position => {
                                    console.log(position);
                                    if (position) {
                                        this.setState({
                                            region: {
                                                latitude: position.coords.latitude,
                                                longitude: position.coords.longitude,
                                                latitudeDelta,
                                                longitudeDelta,
                                            },
                                        }, this.mapRepaint);
                                    }
                                }).catch(err => {
                                    console.log(err);
                                    this.setState({
                                        region: defaultRegion,
                                    }, this.mapRepaint);
                                });
                            });
                        }}
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={[mapStyles.map, {flex: 1, marginBottom: this.state.mapMarginBottom}]}
                        region={this.state.region}
                        showsUserLocation={true}
                        onPress={(e) => this.handlePressForCirclesAndMarkers(e.nativeEvent)}
                        followsUserLocation={true}
                        showsMyLocationButton={true}
                        customMapStyle={MAP_CONFIG.styles}
                    >
                        {this.state.markers.map(marker => {
                            return <Marker key={'marker' + new Date().getTime()} {...marker} />
                        })}
                        {this.state.circles.map(circle => {
                            return <Circle ref={ref => { this.circle = ref; }} fillColor='rgba(54, 201, 154, .5)' key={'circle' + new Date().getTime()} {...circle} />
                        })}
                    </MapView>
                    {/*<GooglePlacesInput/>*/}

                    {this.state.circles.length ?
                        <View style={{backgroundColor: '#fff', marginBottom: (height * 0.05), padding: 10, justifyContent: 'center'}}>
                            <Text style={{alignSelf:'center'}}>{Number(this.state.ms / 1000).toFixed(2)} kms.</Text>
                            <Text style={{alignSelf:'center', fontWeight: 'bold'}}>Radio de cobertura</Text>
                            <Slider
                                style={{width: (width * 0.9), height: (height * 0.05), alignSelf: 'center'}}
                                minimumValue={minimumRangeSlider}
                                maximumValue={50000}
                                value={this.state.ms}
                                minimumTrackTintColor="#CCCCCC"
                                maximumTrackTintColor="#000000"
                                onValueChange={(value) => this.onSliderValueChange(value)}
                            />
                            <TouchableOpacity style = {ApplicationStyles.buttonMapZone}
                                              onPress = {() => this.parseMapDataAndGoToPriceStep()}>
                                <Text style = {ApplicationStyles.buttonText}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                            :
                        <View style={{backgroundColor: '#fff', marginBottom: (height * 0.1), padding: 10, justifyContent: 'center'}}>
                            <Text>Elige un punto de atención en el mapa</Text>
                        </View>
                    }

                </View>
            </Container>

        );
    }
}
