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
	Modal,
	TextInput,
	Button,
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { Images, Fonts, Metrics, Colors } from '../../Themes/';
import CheckBox from 'react-native-check-box';
import FloatingLabelInput from '../../components/FloatingLabelInput';

export default class Address extends Component {

    static navigationOptions = {
        header: null,
        headerMode: 'none'
    };

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			number: '',
			address: '',
			modalVisible: false,
			modalCategoryVisible: false,
			modalSortVisible: false,
			selectedLots: '1',
			data: [
				{
					id: 1,
					UserName: 'Casa',
					UserNumber: 'Francisco Madero 666, Ciudadela',
					UserAddress: 'Buenos Aires, Argentina',
				},
				{
					id: 2,
					UserName: 'Trabajo',
                    UserNumber: 'Fray Cayetano Rodríguez 999, Flores',
                    UserAddress: 'CABA, Buenos Aires, Argentina',
				},
			],
		};
	}

	onBackClick() {
		this.props.navigation.goBack();
	}

	onClick() {}

	onCheckBoxPress(id) {
		this.setState({
			selectedLots: id,
		});
	}

	toggleSortModal(visible) {
		this.setState({ modalSortVisible: visible });
		console.log('true');
	}

	_handleSortModal() {
		this.setState({ modalSortVisible: false });
		this.toggleSortModal(true);
	}

	componentWillMount() {
		var that = this;
		BackHandler.addEventListener('hardwareBackPress', function() {
			that.props.navigation.navigate('ECommerceMyAccount');
			return true;
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
						<Text style={styles.textTitle}>Locaciones</Text>
					</Body>
					<Right style={styles.right}>
						<TouchableOpacity
							style={styles.backArrow}
							onPress={() => {
								this.toggleSortModal(true);
							}}>
							<Ionicons name="md-add" size={32} color="white" />
						</TouchableOpacity>
					</Right>
				</Header>

				<View style={{ height: Metrics.HEIGHT * 0.9, width: Metrics.WIDTH }}>
					{/*<View style={styles.shippingAddressView}>
						<Text style={styles.shippingAddressText}>SHIPPING ADDRESS</Text>
					</View>
					<View style={styles.shippingAddressDivider} />*/}

					<Content>
						{this.state.data.map((item, index) => {
							return (
								<TouchableOpacity
									key={index}
									onPress={() => this.onCheckBoxPress(item.id)}>
									<View style={styles.rowMain}>
										<View style={styles.addressTextBg}>
											<Text
												style={[
													styles.addressText,
													{
														color: '#111111',
														paddingBottom: Metrics.HEIGHT * 0.01,
													},
												]}>
												{item.UserName}
											</Text>
											<Text
												style={[
													styles.addressText,
													{
														color: '#959595',
														paddingBottom: Metrics.HEIGHT * 0.01,
													},
												]}>
												{item.UserNumber}
											</Text>
											<Text style={[styles.addressText, { color: '#959595' }]}>
												{item.UserAddress}
											</Text>
										</View>
										{this.state.selectedLots == item.id ? (
											<CheckBox
												onClick={() => this.onClick()}
												isChecked={true}
												checkBoxColor={'#fff'}
												checkedImage={
													<FontAwesome
														name="check-circle"
														size={25}
														color="#ffc700"
													/>
												}
											/>
										) : null}
									</View>
									<View style={styles.addressDivider} />
								</TouchableOpacity>
							);
						})}
					</Content>
				</View>

				<Modal
					style={styles.modalView}
					transparent={true}
					visible={this.state.modalSortVisible}
					onRequestClose={() => {
						this.state.modalSortVisible(false);
					}}>
					<View style={styles.model}>
						<View style={styles.modell}>
							<View style={styles.modalHeader}>
								<TouchableOpacity
									onPress={() => {
										this.setState({ modalSortVisible: false });
									}}>
									<Text style={styles.cancelApplyTxt}>Cancelar</Text>
								</TouchableOpacity>

								<Text style={styles.cancelApplyTxttt}>Nueva Dirección</Text>

								<TouchableOpacity
									onPress={() => {
										this.setState({ modalSortVisible: false });
									}}>
									<Text style={styles.cancelApplyTxtt}>Guardar</Text>
								</TouchableOpacity>
							</View>

							<View style={styles.floatingView}>
								<FloatingLabelInput
									label="Name"
									value={this.state.name}
									keyboardType="default"
									returnKeyType="done"
									maxLength={30}
									selectionColor={'#959595'}
									autoCapitalize="none"
									onChangeText={name => this.setState({ name })}
								/>

								<View style={{ height: 10 }} />
								<FloatingLabelInput
									value={this.state.number}
									label="Number"
									keyboardType="phone-pad"
									returnKeyType="done"
									maxLength={10}
									selectionColor={'#959595'}
									autoCapitalize="none"
									onChangeText={number => this.setState({ number })}
								/>

								<View style={{ height: 10 }} />
								<FloatingLabelInput
									label="Address"
									value={this.state.address}
									keyboardType="default"
									returnKeyType="done"
									maxLength={40}
									selectionColor={'#959595'}
									autoCapitalize="none"
									onChangeText={address => this.setState({ address })}
								/>
							</View>
						</View>
					</View>
				</Modal>
			</Container>
		);
	}
}
