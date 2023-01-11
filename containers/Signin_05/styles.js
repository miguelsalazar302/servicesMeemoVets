
import { Platform, StyleSheet, Dimensions } from 'react-native';
import { Fonts, Metrics, Colors } from '../../Themes/';

const colorPrimary = '#51CBBF';

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.transparent,
    height: Metrics.WIDTH * 0.15,
    borderBottomWidth: 0,
    ...Platform.select({
      ios: {},
      android: {
				marginTop: Fonts.moderateScale(15)
			}
    }),
		elevation: 0
  },
	left: {
		flex: 0.5,
		backgroundColor: 'transparent',
  },
	backArrow: {
		justifyContent: 'center',
		alignItems: 'center',
    width: 30
  },
	body: {
		flex: 3,
		alignItems: 'center',
		backgroundColor: 'transparent'
  },
	textTitle: {
    color: Colors.snow,
    fontSize: Fonts.moderateScale(16),
    marginTop: 5,
    alignSelf: 'center',
	  fontFamily: Fonts.type.sfuiDisplaySemibold,
  },
	right: {
    flex: 0.5
  },
  imgContainer: {
    width: Metrics.WIDTH,
    height: Metrics.HEIGHT,
  },
  logoSec:{
      marginTop: 10,
    width: Metrics.WIDTH,
    height: Metrics.HEIGHT * 0.24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLogoMountify: {
    alignSelf: 'center',
    width: Metrics.WIDTH * 0.61,
    height: Metrics.WIDTH * 0.27,
  },
    profileImage: {
        width: Metrics.HEIGHT * 0.15,
        height: Metrics.HEIGHT * 0.15,
        borderRadius: Metrics.HEIGHT * 0.075,
        borderColor: "white",
        borderWidth: 3,
        alignSelf: "center",
        marginBottom: Metrics.HEIGHT * 0.08
    },
    profileImageError: {
        borderColor: "red",
    },
    textPolicyDescription: {
        color: "white",
        fontSize: Fonts.moderateScale(11),
        fontFamily: Fonts.type.SFUIDisplayRegular,
        alignSelf: "center"
    },

    textTermsCondition: {
        color: "white",
        fontSize: Fonts.moderateScale(12),
        fontFamily: Fonts.type.SFUIDisplaySemibold
    },
    tandc: {
        flexDirection: "row",
        width: Metrics.WIDTH,
        justifyContent: "center"
    },
    and: {
        color: "white",
        fontSize: Fonts.moderateScale(12),
        fontFamily: Fonts.type.SFUIDisplayRegular
    },
    tandcondi: {
        marginTop: Metrics.HEIGHT * 0.08
    },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: (Metrics.WIDTH * 0.42),
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    alignSelf: 'center',
    width: (Metrics.WIDTH * 0.84),
    fontSize: Fonts.moderateScale(16),
    fontFamily: Fonts.type.sfuiDisplayRegular,
  },
    textInputError: {
    backgroundColor: "#fff",
    borderColor: "#f00",
    borderWidth: 2,
    borderRadius: (Metrics.WIDTH * 0.42),
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    alignSelf: 'center',
    width: (Metrics.WIDTH * 0.84),
    fontSize: Fonts.moderateScale(16),
    fontFamily: Fonts.type.sfuiDisplayRegular,
  },
  textArea: {
    backgroundColor: "#fff",
    borderRadius: (Metrics.WIDTH * 0.1),
    textAlignVertical: 'top',
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    alignSelf: 'center',
    width: (Metrics.WIDTH * 0.84),
    fontSize: Fonts.moderateScale(16),
    fontFamily: Fonts.type.sfuiDisplayRegular,
  },
  textAreaError: {
    backgroundColor: "#fff",
    borderColor: "#f00",
    borderWidth: 2,
    borderRadius: (Metrics.WIDTH * 0.1),
    textAlignVertical: 'top',
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    alignSelf: 'center',
    width: (Metrics.WIDTH * 0.84),
    fontSize: Fonts.moderateScale(16),
    fontFamily: Fonts.type.sfuiDisplayRegular,
  },
  buttonSignIn: {
    backgroundColor: colorPrimary,
    borderRadius: 20,
    marginTop: 28,
    marginBottom: 28,
    padding: 12,
    alignSelf: 'center',
    width: (Metrics.WIDTH * 0.84),
  },
  signInText: {
    color: Colors.snow,
    textAlign: "center",
    fontSize: Fonts.moderateScale(16),
    fontFamily: Fonts.type.sfuiDisplaySemibold,
  },
  textForgotPsssword: {
    textAlign: 'center',
    fontSize: Fonts.moderateScale(14),
    color: Colors.snow,
    marginBottom: 30,
    marginTop: 30,
    fontFamily: Fonts.type.sfuiDisplayRegular,
  },
  textSignUp: {
    textAlign: 'center',
    fontSize: Fonts.moderateScale(18),
    color: Colors.snow,
    marginBottom: 60,
    fontFamily: Fonts.type.sfuiDisplayRegular,
  },
  signInWithFbBg: {
    backgroundColor: "#3b5998",
    borderRadius: (Metrics.WIDTH * 0.42),
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: (Metrics.WIDTH * 0.84),
    alignSelf: 'center',
    marginBottom: 30,
    flexDirection: 'row'
  },
  signInWithFbText: {
    color: Colors.snow,
    textAlign: "center",
    fontSize: Fonts.moderateScale(16),
    padding: 3,
    left: 5,
    fontFamily: Fonts.type.sfuiDisplayRegular,
  },
    separatorText: {
        color: "white",
        marginTop: 30,
        fontSize: Fonts.moderateScale(22),
        fontFamily: Fonts.type.SFUIDisplaySemibold
    },
    linkText: {
        color: "white",
        marginTop: 10,
        marginBottom: 10,
        fontSize: Fonts.moderateScale(16),
        fontFamily: Fonts.type.SFUIDisplaySemibold
    },
    pickerView: {
        backgroundColor: "#fff",
        borderRadius: (Metrics.WIDTH * 0.42),
        marginTop: 10,
        alignSelf: 'center',
        width: (Metrics.WIDTH * 0.84),
    },
    pickerMultiSelectDropdownMenu: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 10,
        backgroundColor: "#fff",
        borderRadius: (Metrics.WIDTH * 0.42),
        marginTop: 10,
        alignSelf: 'center',
        width: (Metrics.WIDTH * 0.84),
    },
    pickerViewMultiSelect: {
        backgroundColor: "transparent",
        // borderRadius: (Metrics.WIDTH * 0.42),
        marginTop: 10,
        alignSelf: 'center',
        // height: (Metrics.HEIGHT * 0.80),
        width: (Metrics.WIDTH * 0.84),
        // zIndex: 1000
    },
    pickerViewMultiSelectOnToggleList: {
        backgroundColor: "transparent",
        borderRadius: 0,
        marginTop: 0,
        alignSelf: 'center',
        width: (Metrics.WIDTH * 0.84),
    },
    picker: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        alignSelf: 'center',
        width: (Metrics.WIDTH * 0.84),
        fontSize: Fonts.moderateScale(16),
        fontFamily: Fonts.type.sfuiDisplayRegular,
    },
    pickerMultiSelect: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 15,
        paddingRight: 15,
        alignSelf: 'center',
        width: (Metrics.WIDTH * 0.84),
    },
    pickerMultiSelectDropdownMenuSubsection: {
        paddingTop: 0,
        paddingBottom: 0,
        borderBottomWidth: 0,
        alignSelf: 'center',
        width: (Metrics.WIDTH * 0.94),
    },
    pickerMultiSelectSelectorContainer: {
      backgroundColor: '#fff'
    },
    pickerMultiSelectText: {
        fontSize: Fonts.moderateScale(16),
        fontFamily: Fonts.type.sfuiDisplayRegular,
    },
    pickerMultiSelectTransparent: {
        backgroundColor: 'transparent',
        paddingLeft: 0,
        paddingRight: 0,
        width: (Metrics.WIDTH * 0.87),
        alignSelf: 'flex-start',
        borderWidth: 0
    },
    pickerMultiSelectRed: {
        backgroundColor: '#f00',
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 15,
        paddingRight: 15,
        alignSelf: 'center',
    },
	chboxConatiner: {
		flexDirection: 'row',
		width: (Metrics.WIDTH * 0.84),
		height: Metrics.HEIGHT * 0.10,
		alignItems: 'center',
		alignSelf: 'center',
	},
	chboxRemember: {
		width: 25,
		height: 25,
		borderRadius: 10,
	},
	textRememberMe: {
		color: Colors.snow,
		fontSize: Fonts.moderateScale(16),
		fontFamily: Fonts.type.sfuiDisplayRegular,
		marginLeft: Fonts.moderateScale(10),
  },
  
  textRememberMeSmall: {
		color: Colors.snow,
		fontSize: Fonts.moderateScale(14),
		fontFamily: Fonts.type.sfuiDisplayRegular,
		marginLeft: Fonts.moderateScale(10),
	},
});
export default styles;
