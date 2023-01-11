import { Platform, StyleSheet, Dimensions } from 'react-native';
import {  Fonts,Metrics, Colors } from '../../Themes/';

const colorPrimary = '#51CBBF';

const styles = StyleSheet.create({

	container: {
		height: Metrics.HEIGHT,
		width: Metrics.WIDTH,
		backgroundColor: Colors.snow
	},

	header: {
		// backgroundColor: "#2d324f",
		backgroundColor: "#0e1130",
		height: (Metrics.HEIGHT * 0.1),
		paddingHorizontal: (Metrics.WIDTH * 0.05),
		borderBottomWidth: 0,
		...Platform.select({
			ios: {
				paddingTop: (Metrics.HEIGHT * 0.02),
			},
			android: {
				paddingTop: Metrics.WIDTH * 0.04
			}
		}),
		elevation: 0,
		paddingLeft: (Metrics.WIDTH * 0.05),
	},
	left: {
		flex: 0.5,
		backgroundColor: Colors.transparent,
	},

	body: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: Colors.transparent
	},

	textTitle: {
		color: Colors.snow,
		fontSize: Fonts.moderateScale(20),
		alignSelf: 'center',
		fontFamily:  Fonts.type.helveticaNeueLight,
		// fontFamily: Fonts.type.helveticaNeueLight,
	},

	right: {
		flex: 0.5,
		alignItems: 'center',
	},

	backArrow: {
		justifyContent: 'center',
		alignItems: 'center',
  },

	heartBg: {
		width: Metrics.WIDTH * 0.054,
		height: Metrics.WIDTH * 0.054,
		borderRadius: Metrics.WIDTH * 0.027,
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: Colors.snow,
		alignItems: 'center',
		justifyContent: 'center',
	},

	bagIcon: {
		marginLeft: Metrics.WIDTH * 0.04,
		color: Colors.snow
	},

	heartIcon: {
		color: Colors.snow,
		alignSelf: 'center'
	},

	content: {
		width: Metrics.WIDTH,
		height: Metrics.HEIGHT * 0.9
	},

	divider: {
		borderTopWidth: Metrics.HEIGHT * 0.001,
		borderColor: Colors.gray,
	},

	loginSignUpTxt: {
		fontSize: Fonts.moderateScale(16),
		fontFamily: Fonts.type.sfuiDisplayRegular
	},

	facebookBtnBg: {
		backgroundColor :"#0054a6",
		width: Metrics.WIDTH * 0.94,
		alignSelf: 'center',
		borderRadius: 5,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: Metrics.WIDTH * 0.025,
		paddingBottom: Metrics.WIDTH * 0.025,
	},

	loginWithFacebookTxt: {
		color: Colors.snow,
		fontSize: Fonts.moderateScale(17),
		// fontFamily: Fonts.type.sfuiDisplayLight,
		marginLeft: Metrics.WIDTH * 0.03
	},

	loginSignUpContent: {
		...Platform.select({
      ios: {
				height: Metrics.HEIGHT * 0.714,
			},
      android: {
        height: Metrics.HEIGHT * 0.7,
      }
    }),
		width: Metrics.WIDTH * 0.94,
		alignSelf: 'center'
	},

	textInput: {
    height:Metrics.HEIGHT*0.07,
    alignSelf: 'center',
    width: (Metrics.WIDTH * 0.90),
    fontSize: Fonts.moderateScale(14),
    fontFamily: Fonts.type.SFUIDisplayRegular,
    color: "#959595",
    marginLeft: 15,
    paddingLeft: 15,
    marginTop: Metrics.HEIGHT*0.02,
		backgroundColor: 'red'
  },

	 forgotPasswordTxt: {
		 color: "#0691ce",
		 fontSize: Fonts.moderateScale(16),
		 fontFamily: Fonts.type.sfuiDisplayRegular
	 },

	 bottomView: {
		 width: Metrics.WIDTH,
		 bottom: 0,
		 position: 'absolute',
		 borderTopWidth: Metrics.HEIGHT * 0.001,
		 borderColor: Colors.gray,
		 alignItems: 'center'
	 },

	 submitBg: {
		 backgroundColor: colorPrimary,
		 width: Metrics.WIDTH * 0.9,
		 height: Metrics.HEIGHT * 0.055,
		 marginVertical: Metrics.HEIGHT * 0.02,
		 alignSelf: 'center',
		 justifyContent: 'center',
		 alignItems: 'center',
		 borderRadius: 5,
	 },

	 alertBg: {
		 width: Metrics.WIDTH * 0.03,
		 height: Metrics.WIDTH * 0.03,
		 borderRadius: Metrics.WIDTH * 0.015,
		 backgroundColor: '#ff0000',
		 alignItems: 'center',
		 justifyContent: 'center',
		 marginLeft: -(Metrics.WIDTH * 0.018),
	 },

	 alertTxt: {
		 fontSize: Fonts.moderateScale(8),
		 fontFamily: Fonts.type.sfuiDisplayMedium,
		 color: Colors.snow,
	 },

	 textLabel: {
		  fontFamily:Fonts.type.SFUIDisplayRegular,
 			color: "#959595",
			fontSize: Fonts.moderateScale(15),
			marginLeft: 10
	 },

	 dropdown: {
		 width: Metrics.WIDTH * 0.94,
		 alignSelf: 'center',
		 height: Metrics.HEIGHT * 0.07,
		 backgroundColor: 'red'
	 },

	 picker: {
		 width: Metrics.WIDTH * 0.94,
		 alignSelf: 'center',
		 height: Metrics.HEIGHT * 0.07,
		 backgroundColor: 'green'
	 },

	 activeTab: {
 		color: Colors.darkBlue,
 	// 	fontFamily: Fonts.type.helveticaNeueLight,
 		fontSize: Fonts.moderateScale(15),
 	},

 	normalTab: {
 		color: colorPrimary,
 	// 	fontFamily: Fonts.type.helveticaNeueLight,
 		fontSize: Fonts.moderateScale(15),
 	},

	segmentTab: {
		width: Metrics.WIDTH * 0.47,
		height: Metrics.HEIGHT * 0.05,
		backgroundColor: 'transparent',
		borderColor: colorPrimary,
		justifyContent: 'center',
		alignSelf: 'center',
	},

	segmentSelectedTab: {
		width: Metrics.WIDTH * 0.47,
		height: Metrics.HEIGHT * 0.05,
		backgroundColor: colorPrimary,
		borderColor: colorPrimary,
		justifyContent: 'center',
		alignSelf: 'center',
		//borderRadius: Metrics.HEIGHT * 0.007,
	},

	segmentTabSec: {
		width: Metrics.WIDTH * 0.94,
		height: Metrics.HEIGHT * 0.05,
		marginVertical: Metrics.HEIGHT * 0.03,
		/*borderRadius: Metrics.HEIGHT * 0.007,*/
		backgroundColor: Colors.snow,
		borderColor: colorPrimary,
		padding:0,
		borderWidth: 1,
		alignSelf: 'center',
	},

	detailContainer: {
		marginHorizontal: (Metrics.WIDTH * 0.05),
		height: (Metrics.HEIGHT * 0.79),
	},

	reviewContainer: {
		height: (Metrics.HEIGHT * 0.79),
	},

	productDetail: {
		marginTop: (Metrics.HEIGHT * 0.002)
	},

	textStyle: {
 		color: Colors.lightBlack,
 	// 	fontFamily: Fonts.type.helveticaNeueLight,
 		fontSize: Fonts.moderateScale(15),
		textAlign: 'left'
	},

	textStyleBold: {
 		color: Colors.lightBlack,
 		fontFamily: Fonts.type.helveticaRegular,
 		fontSize: Fonts.moderateScale(15),
		textAlign: 'left'
	},

	textStylePrise: {
 		color: Colors.lightBlack,
 	// 	fontFamily: Fonts.type.helveticaNeueLight,
 		fontSize: Fonts.moderateScale(15),
		textDecorationLine: 'line-through',
	},

	discountPrise: {
 		color: Colors.red,
 		fontFamily: Fonts.type.helveticaNeueBold,
 		fontSize: Fonts.moderateScale(15),
	},

	textStyleBrand: {
		textDecorationLine: 'underline',
	},

	contentSpace: {
		marginTop: (Metrics.HEIGHT * 0.025),
		marginBottom: (Metrics.HEIGHT * 0.025)
	},

	row: {
		flexDirection: 'row'
	},

	productImage: {
		height: Metrics.HEIGHT * 0.135,
		width: Metrics.WIDTH * 0.185,
		marginHorizontal: Metrics.WIDTH * 0.02,
	},

	inputStyle: {
		color: Colors.drakBlue,
		fontSize: Fonts.moderateScale(15),
		fontFamily:Fonts.type.helveticaNeueLight,
	},

	placeholderStyle: {
 		color: Colors.lightGray,
 	// 	fontFamily: Fonts.type.helveticaNeueLight,
 		fontSize: Fonts.moderateScale(15),
	},

	ratingStyle: {
		width: Metrics.WIDTH,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: Metrics.HEIGHT * 0.035,
		marginBottom: Metrics.HEIGHT * 0.045,
	},

	reviewDivider: {
		backgroundColor: "#e1e1e1",
		width: Metrics.WIDTH,
		height: 1,
		marginTop: Metrics.WIDTH * 0.01,
	},

	item: {
		alignSelf:'center',
		width: Metrics.WIDTH * 0.90,
		justifyContent: 'center',
		marginTop: 10,
	},

	floatingView: {
		alignSelf:'center',
		width: Metrics.WIDTH * 0.90,
		justifyContent: 'center',
		marginTop: 10,
	},

	inputemail: {
		fontFamily:Fonts.type.SFUIDisplayRegular,
		color: "#959595",
		fontSize: Fonts.moderateScale(15),
		marginTop: -10,
	 },

	 textLabel: {
		  fontFamily:Fonts.type.SFUIDisplayRegular,
 			color: "#959595",
			fontSize: Fonts.moderateScale(15),
			marginLeft: 10
	 },
	 profileImg: {
		width: (Metrics.WIDTH) * 0.16,
		height: (Metrics.WIDTH) * 0.16,
		borderRadius: (Metrics.WIDTH) * 0.08,
		alignSelf: 'flex-start',
	  },

});


export default styles;
