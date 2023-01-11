import { Platform, StyleSheet, Dimensions } from 'react-native';
import {  Fonts,Metrics, Colors } from '../../../Themes/';

const styles = StyleSheet.create({

	container: {
		height: Metrics.HEIGHT,
		width: Metrics.WIDTH,
		backgroundColor: Colors.snow
	},

	header: {
    backgroundColor: "#0e1130",
		height: Metrics.HEIGHT * 0.1,
		borderBottomWidth: 0,
		paddingTop: (Metrics.HEIGHT * 0.02),
		elevation: 0,
		paddingLeft: (Metrics.WIDTH * 0.05),
		paddingRight: (Metrics.WIDTH * 0.05),
  },

	left: {
		flex: 0.5,
		backgroundColor: Colors.transparent,
  },

	backArrow: {
		justifyContent: 'center',
		alignItems: 'center',
  },

	body: {
		flex: 3,
		alignItems: 'center',
		backgroundColor: Colors.transparent
  },

	textTitle: {
    color: Colors.snow,
    fontSize: Fonts.moderateScale(18),
    alignSelf: 'center',
		fontFamily: Fonts.type.helveticaNeueLight,
  },

	right: {
    flex: 0.5,
		backgroundColor: Colors.transparent,
    alignItems: 'center',
  },

	content: {
		height: Metrics.HEIGHT * 0.72,
		width: Metrics.WIDTH,
		backgroundColor: Colors.snow
	},

	imageLogo: {
		width: Metrics.HEIGHT * 0.3,
		height: Metrics.HEIGHT * 0.3,
		alignSelf: 'center',
		marginTop: Metrics.HEIGHT * 0.1
	},

	descriptionTxtBg: {
		width: Metrics.WIDTH * 0.84,
		alignSelf: 'center',
		marginTop: Metrics.WIDTH * 0.03,
		flexDirection: 'row',
	},

	descriptionTxt: {
		color: "#0d0e1b",
		fontSize: Fonts.moderateScale(14),
	},

	invitationCodeTxt: {
		color: "#959595",
		fontFamily: Fonts.type.helveticaRegular,
		fontSize: Fonts.moderateScale(16),
		marginTop: Metrics.HEIGHT * 0.07,
		textAlign: 'center'
	},

	codeTxt: {
		color: "#0d0e1b",
		textAlign: 'center',
		fontFamily: Fonts.type.helveticaRegular,
		fontSize: Fonts.moderateScale(16),
	},

	bottomView: {
		height: Metrics.HEIGHT * 0.18,
		width: Metrics.WIDTH,
		backgroundColor: Colors.snow,
		justifyContent: 'center',
	},

	shareWithEmailFbBg: {
    width: Metrics.WIDTH * 0.94,
    alignSelf: 'center',
    height: Metrics.HEIGHT * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 5,

    },

    shareWithEmailFbTxt: {
	    color: Colors.snow,
	    fontSize: Fonts.moderateScale(15),
	    fontFamily: Fonts.type.helveticaNeueLight,
	    paddingLeft: Metrics.WIDTH * 0.03,
    }


});


export default styles;
