import React, {Component} from 'react';
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
import {Container, Icon} from 'native-base';

import Slider from '@react-native-community/slider';

import ApplicationStyles from './../../Themes/ApplicationStyles';

import Geolocation from '@react-native-community/geolocation';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import Helpers from "../../modules/Helpers";

import MapView, {PROVIDER_GOOGLE, Marker, Circle} from 'react-native-maps';
import APIService from "../../modules/ApiService";
import Loading from "../../components/loading";

const {width, height} = Dimensions.get('window');
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

const latitudeDelta = 0.015;
const longitudeDelta = 0.0121;
const latitude = -34.603572;
const longitude = -58.381402;

const defaultRegion = {
	latitude,
	longitude,
	latitudeDelta,
	longitudeDelta,
};


export default class MapZoneVet extends Component {
	static navigationOptions =
	  ({navigation}) => (
		{
			headerLeft: <Icon name="arrow-back"
			                  size={30} color='#ffffff'
			                  style={{paddingLeft: 20, color: "#fff"}}
			                  onPress={() => {
				                  navigation.goBack()
			                  }}/>,
			title: 'Mapa',
			headerTitleStyle: {
				alignSelf: 'center',
				textAlign: 'center'
			},
		});

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			mapMarginBottom: 1,
			markers: [],
			region: null,
		};

		this.helpers = new Helpers();
		this.api = new APIService();

		// this.handlePressForMarkers = this.handlePressForMarkers.bind(this);
		// this.handlePressForCircles = this.handlePressForCircles.bind(this);
	}

	componentDidMount() {
		// this.setInitialState();
	}

	setInitialState() {
		const markerLat = this.props.navigation.getParam('markerLat');
		const markerLng = this.props.navigation.getParam('markerLng');
		if (markerLat && markerLng) {
			const obj = {
				coordinate: {
					latitude: Number(markerLat),
					longitude: Number(markerLng),
				}
			};
			this.handlePressForMarkers(obj);
		}
		this.setState({
			loading: false
		});
	}

	getCurrentLocation() {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
		});
	};

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

	mapRepaint() {
		console.log('mapRepaint');
		this.setState({
			mapMarginBottom: this.state.mapMarginBottom ? 1 : 0
		})
	}

	render() {
		StatusBar.setBarStyle('light-content', true);
		if (Platform.OS === 'android') {
			StatusBar.setBackgroundColor('transparent', true);
			StatusBar.setTranslucent(true);
		}

		return (
		  <Container style={{backgroundColor: '#2d324f', flex: 1}}>
			  {this.state.loading ? <Loading/> : null}
			  <View style={mapStyles.container}>
				  <MapView
				    liteMode
					onMapReady={() => {
						this.setInitialState();
					}}
					provider={PROVIDER_GOOGLE} // remove if not using Google Maps
					style={[mapStyles.map, {flex: 1, marginBottom: this.state.mapMarginBottom}]}
					region={this.state.region}
					showsUserLocation={false}
					// onPress={(e) => this.handlePressForMarkers(e.nativeEvent)}
					followsUserLocation={false}
					showsMyLocationButton={false}
				  >
					  {this.state.markers.map(marker => {
						  return <Marker key={'marker' + new Date().getTime()} {...marker} />
					  })}
				  </MapView>
			  </View>
		  </Container>

		);
	}
}