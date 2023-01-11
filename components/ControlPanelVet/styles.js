import { StyleSheet, PixelRatio, Platform } from 'react-native';
// const deviceScreen = require('Dimensions').get('window');
import { Fonts, Metrics, Colors } from '../../Themes/';

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C5B9C9',
  },
  drawercontainer:{
    width: Metrics.WIDTH,
    height: Metrics.HEIGHT,
    backgroundColor: '#2d324f',
  },
  headerSec: {
    backgroundColor: Colors.transparent,
    height: Metrics.WIDTH * 0.15,
    borderBottomWidth: 0,
    ...Platform.select({
      ios: {},
      android: {
				marginTop: Fonts.moderateScale(25)
			}
    }),
		elevation: 0
  },
	left: {
		flex: 0.5,
		backgroundColor: 'transparent',
  },
	backArrow: {
    width:30,
		justifyContent: 'center',
		alignItems: 'center'
  },
	body: {
		flex: 3,
		alignItems: 'center',
		backgroundColor: 'transparent'
  },
	textTitle: {
    color: "#fff",
    fontSize: Fonts.moderateScale(16),
    marginTop: 5,
    alignSelf: 'center',
	  fontFamily: Fonts.type.sfuiDisplaySemibold,
  },
	right: {
    flex: 0.5
  },
  mainText:{
    color: "#0691ce",
    fontSize: Fonts.moderateScale(17),
    height: (Metrics.HEIGHT * 0.05),
    width: (Metrics.WIDTH),
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'transparent',
    top:(Metrics.HEIGHT * 0.44),
    fontFamily: Fonts.type.sfuiDisplayRegular,
  },



  /*Menu Section START*/
  menuContainer:{
    backgroundColor: '#11142a',
    width: Metrics.WIDTH,
    height: Metrics.HEIGHT,
    paddingTop: Fonts.moderateScale(25),
  },
  menucontrolPanel: {
    // flex: 1,
    paddingTop: Fonts.moderateScale(25),
    // paddingLeft: Fonts.moderateScale(20),
  },
  userProfiles:{
    width: (Metrics.WIDTH) * 0.88,
    paddingTop: Fonts.moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImageStyle:{
    width: (Metrics.WIDTH) * 0.20,
    height: (Metrics.WIDTH) * 0.20,
    borderRadius: (Metrics.WIDTH)* 0.10,
    borderWidth: 2,
    borderColor: Colors.snow,
    marginLeft: 10,
    marginRight: 10
  },
  userDetailsStyle:{
    backgroundColor: 'transparent',
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    marginLeft: 10
  },
  userDetailsText:{
    fontSize: Fonts.moderateScale(15),
    color: Colors.snow,
  },
  menumainview:{
    width: (Metrics.WIDTH) * 0.84,
    /*marginTop: Fonts.moderateScale(25),*/
    justifyContent: 'center',
    alignItems: 'center'
  },
  listrow:{
		backgroundColor: 'transparent',
		flexDirection: 'row',
		width: (Metrics.WIDTH) * 0.60,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		marginBottom: 15,
	},
  rowtxt:{
    color: Colors.snow,
    fontSize: Fonts.moderateScale(18),
    backgroundColor: 'transparent',
    marginLeft: Fonts.moderateScale(15),
    textAlign: 'left',
    fontFamily: Fonts.type.sfuiDisplayLight,
  },
  versiontxt:{
    color: Colors.lighttxt,
    fontSize: Fonts.moderateScale(15),
    backgroundColor: 'transparent',
    marginLeft: Fonts.moderateScale(12),
    textAlign: 'center',
    fontFamily: Fonts.type.sfuiDisplayLight,
  },
  emergencyWrapper:{
      backgroundColor: Colors.error,
      marginTop: 3,
      marginBottom: 40,
      borderRadius: 10,
      padding: 10,
      marginLeft: Fonts.moderateScale(15),
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 11111
  },
  emergencyText:{
      color: Colors.snow,
      fontSize: Fonts.moderateScale(18),
      backgroundColor: 'transparent',
      textAlign: 'center',
      fontFamily: Fonts.type.sfuiDisplayLight,
  },
  notiCountSec:{
    backgroundColor: '#d9b63e',
    marginLeft: 10,
    marginTop: 3,
    borderRadius: 10,
    height: 17,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    zIndex: 11111
  },
  notiCount:{
    color: Colors.snow,
    fontSize: Fonts.moderateScale(13),
  },
  userProfilestyleSec:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  /*Menu Section END*/

});
