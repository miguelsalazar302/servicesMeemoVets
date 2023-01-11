
import { Platform, StyleSheet, Dimensions, I18nManager } from 'react-native';

import { Fonts, Metrics, Colors } from '../../../Themes/';

const colorPrimary = '#51CBBF';
const styles = StyleSheet.create({

logosec:{
	height: (Metrics.HEIGHT*0.095),
	marginTop: (Platform.OS === 'ios')? 0 : (Metrics.HEIGHT*0.035),
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'row'
},
backArrow: {
	width: 30,
 justifyContent: 'center',
 alignItems: 'flex-start'
},
slidesec:{
	height: (Metrics.HEIGHT*0.905),
	position: 'relative',
	backgroundColor: '#e6e6e6',
},
edit:{ color: '#fff', fontSize: 17},
header: {
	backgroundColor: '#2d324f',
	height: 56,
	width: Metrics.WIDTH,
	flexDirection: 'row',
	borderBottomColor: '#2d324f',
	...Platform.select({
		ios: {
			marginTop:5,
			paddingTop: 0,
		},
		android: {}
	}),
	elevation: 0
},

left: {
  flex: 1,
  paddingTop: (Platform.OS === 'ios')? 15 : 0,
},

body: {
  flex: 2,
  alignItems: 'center',

},

right: {
  flex: 1,
  paddingTop: (Platform.OS === 'ios')? 15 : 0,
},

headerTitle: {
  color: 'white',
  fontFamily: 'SFUIDisplay-Bold',
  paddingTop: (Platform.OS === 'ios')? 15 : 0,
  fontSize : 17,
  letterSpacing:0.7
},

profileHeaderMain: {
	backgroundColor: '#2d324f',
	height:(Metrics.HEIGHT * 0.29),
	alignItems: 'center'
},

profileHeaderMainTextOnly: {
	backgroundColor: '#2d324f',
	alignItems: 'center',
	paddingBottom: 10
},

profileImageSec: {
	justifyContent: 'center',
	alignItems: 'center',
	flexDirection: 'row',
	paddingTop: (Metrics.HEIGHT * 0.03)
},

textInput: {
    width:(Metrics.HEIGHT * 0.9),
},


profileImage: {
	height:(Metrics.HEIGHT * 0.14),
	width:(Metrics.HEIGHT * 0.14),
	marginHorizontal: (Metrics.WIDTH * 0.08),
	borderRadius: (Metrics.HEIGHT * 0.07),
	borderWidth: 2.5,
	borderColor: 'white',
	resizeMode: 'cover'
},

activeButton: {
	height:(Metrics.HEIGHT * 0.07),
	width:(Metrics.HEIGHT * 0.07),
	borderRadius:(Metrics.HEIGHT * 0.035),
	backgroundColor: '#0691ce',
	alignItems: 'center',
	justifyContent: 'center',
	overflow: 'hidden'
},

normalButton: {
	height:(Metrics.HEIGHT * 0.07),
	width:(Metrics.HEIGHT * 0.07),
	borderRadius:(Metrics.HEIGHT * 0.035),
	borderWidth: 0.5,
	borderColor: 'white',
	alignItems: 'center',
	justifyContent: 'center',
	overflow: 'hidden'
},
name:{
	fontFamily: 'SFUIDisplay-Semibold',
	fontSize: 18,
	color: 'white',
	marginTop:(Metrics.HEIGHT * 0.018)
},
details:{
	backgroundColor: 'white',
	paddingLeft: (Metrics.WIDTH*0.005)
},

detailsDisabled:{
	backgroundColor: 'transparent',
	paddingLeft: (Metrics.WIDTH*0.005),
	opacity: 0.75
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
    buttonSignInDisabled: {
        backgroundColor: colorPrimary,
        borderRadius: 20,
        marginTop: 28,
        marginBottom: 28,
        padding: 12,
        alignSelf: 'center',
        width: (Metrics.WIDTH * 0.84),
		opacity: 0.75
    },
    signInText: {
        color: Colors.snow,
        textAlign: "center",
        fontSize: Fonts.moderateScale(16),
        fontFamily: Fonts.type.sfuiDisplaySemibold,
    },

listItem: {
	justifyContent: 'space-between',
	height:(Metrics.HEIGHT*0.076),
	borderColor: '#e5e5e5'
},

listItemText: {
	color:'#b7b7b7',
	fontFamily:'SFUIDisplay-Regular',
	fontSize:15
},

listItemText2: {
	color: '#555555',
	fontFamily:'SFUIDisplay-Regular',
	fontSize:15
},

listItemText3: {
	color: '#555555',
	fontFamily:'SFUIDisplay-Regular',
	fontSize:15,
	bottom:10
},

listRight: {
	flexDirection:'row',
	justifyContent: 'flex-end',
	alignItems: 'center'
},

listRightEmail: {
	color:'#6f6f6f',
	fontFamily:'SFUIDisplay-Regular',
	fontSize:15,
	bottom:2
},

arrowForword: {
	color:'#d6d6d6',
	paddingLeft: I18nManager.isRTL ? 0 : (Metrics.WIDTH*0.02),
	paddingRight: I18nManager.isRTL ? (Metrics.WIDTH*0.02) : 0,
	fontSize: 20
},

listFooter: {
	justifyContent: 'center',
	height:(Metrics.HEIGHT*0.076),
	borderColor: 'transparent'
},
dayOfTheWeekBadge: {
	backgroundColor: "#ccc",
	height:(Metrics.HEIGHT * 0.07),
	width:(Metrics.HEIGHT * 0.07),
	borderRadius:(Metrics.HEIGHT * 0.035),
	paddingTop:(Metrics.HEIGHT * 0.024),
	textAlign: "center",
	alignItems: "center",
	textTransform: "uppercase",
},
dayOfTheWeekBadgeEnabled: {
	backgroundColor: "#11142a",
	height:(Metrics.HEIGHT * 0.07),
	width:(Metrics.HEIGHT * 0.07),
	borderRadius:(Metrics.HEIGHT * 0.035),
	paddingTop:(Metrics.HEIGHT * 0.024),
	textAlign: "center",
	alignItems: "center",
	textTransform: "uppercase",
},
dayOfTheWeekBadgeText: {
	color: "#fff",
    fontSize:11
},
    listRightTextInput: {
		paddingTop: (Metrics.HEIGHT * 0.022),
        height:(Metrics.HEIGHT * 0.07),
        width:(Metrics.HEIGHT * 0.07),
		color: '#ccc'
	},
    listRightTextInputEnabled: {
		paddingTop: (Metrics.HEIGHT * 0.022),
        height:(Metrics.HEIGHT * 0.07),
        width:(Metrics.HEIGHT * 0.07),
		color: '#333'
	},
    datePicker: {
        width:(Metrics.WIDTH * 1)
	},
	datePickerLink: {
		color:'#0691ce',
		fontFamily:'SFUIDisplay-Regular',
		fontSize:15,
		width:(Metrics.WIDTH * 1),
		textAlign: 'center',
		marginTop: 10,
		marginBottom: 10
	},
});

export default styles;
