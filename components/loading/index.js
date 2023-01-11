import React, {PropTypes, Component} from 'react';
import {Text} from 'react-native';
import {Grid, Spinner} from 'native-base';
import {Col, Row} from "react-native-easy-grid";

// Images
import appStyles from "../../models/styles";
import {Colors, Fonts} from "../../Themes";

export default class Loading extends Component {

	render() {
		return (
		  <Grid style={appStyles.global.loadingScreen}>
			  <Row>
				  <Col style={{
				  	alignSelf: 'flex-end'
				  }}>
					  <Spinner/>
				  </Col>
			  </Row>
			  <Row>
				  <Col style={{
					  alignSelf: 'flex-start'
				  }}>
					  <Text style={{
						  color: Colors.snow,
						  fontSize: Fonts.moderateScale(18),
						  backgroundColor: 'transparent',
						  marginLeft: Fonts.moderateScale(15),
						  textAlign: 'center',
						  fontFamily: Fonts.type.sfuiDisplayLight,
					  }}>{this.props.text || 'Cargando...'}</Text>
				  </Col>
			  </Row>
		  </Grid>
		);
	}
}
