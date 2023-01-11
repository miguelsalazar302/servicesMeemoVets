
import { Platform, StyleSheet, Dimensions } from 'react-native';

// Screen Styles
import { Fonts, Metrics, Colors } from '../../Themes/';

const styles = StyleSheet.create({

  header: {
		backgroundColor: '#2d324f',
		height: Metrics.HEIGHT * 0.1,
		borderBottomWidth: 0,
		paddingTop: (Metrics.HEIGHT * 0.03),
		elevation: 0,
		paddingLeft: (Metrics.WIDTH * 0.05),
		paddingRight: (Metrics.WIDTH * 0.05),
	},
  backArrow: {
    width: 30,
   justifyContent: 'center',
   alignItems: 'flex-start'
  },
	left: {
		flex: 0.5,
		backgroundColor: Colors.transparent,
	},

	menuIconWhite: {
		justifyContent: 'center',
		alignItems: 'center'
	},

	body: {
		flex: 3,
		alignItems: 'center',
		backgroundColor: Colors.transparent
	},

	textTitle: {
		color: Colors.snow,
		fontSize: Fonts.moderateScale(17),
		marginTop: (Metrics.HEIGHT * 0.001),
		alignSelf: 'center',
		fontFamily: Fonts.type.sfuiDisplayBold,
	},

	right: {
		flex: 0.5
	},

  main: {
    height: Metrics.HEIGHT,
    width: Metrics.WIDTH,
    backgroundColor: Colors.snow,
  },

  settingIcon: {
  	height:(Metrics.HEIGHT*0.03),
  	width:(Metrics.HEIGHT*0.03),
  	resizeMode: 'contain'
  },

  spaceBg: {
    ...Platform.select({
        ios: {
            height: (Metrics.HEIGHT) * 0.56
        },
        android: {
            height: (Metrics.HEIGHT) * 0.50
        }
    }),
    backgroundColor: Colors.transparent,
    width: Metrics.WIDTH
  },

  profileImg: {
    width: (Metrics.WIDTH) * 0.26,
    height: (Metrics.WIDTH) * 0.26,
    borderRadius: (Metrics.WIDTH) * 0.13,
    borderWidth: 3,
    borderColor: Colors.snow,
    alignSelf: 'center',
    marginTop: (Metrics.HEIGHT) * 0.02,
    },

  nameTxt: {
    color: Colors.snow,
    fontSize: Fonts.moderateScale(18),
    textAlign: 'center',
    fontFamily: Fonts.type.sfuiDisplayMedium,
    marginTop: (Metrics.HEIGHT) * 0.025
  },

  designtaionTxt: {
    color: "#9699a7",
    fontSize: Fonts.moderateScale(14),
    textAlign: 'center',
    fontFamily: Fonts.type.sfuiDisplayRegular
  },

  overlayContentBg: {
    flexDirection: 'column',
    ...Platform.select({
      ios: {
        paddingTop: (Metrics.HEIGHT) * 0.3,
      },
      android: {
        paddingTop: (Metrics.HEIGHT) * 0.32,
      }
    }),
    width: (Metrics.WIDTH) * 0.94,
    alignSelf: 'center',
  },

  cardBg: {
    backgroundColor: Colors.snow,
    width: (Metrics.WIDTH) * 0.94,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: (Metrics.HEIGHT) * 0.03
  },

  cardBgTwo: {
    backgroundColor: Colors.snow,
    width: (Metrics.WIDTH) * 0.94,
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: (Metrics.HEIGHT) * 0.03
  },

  aboutLabelTxt: {
    margin: (Metrics.WIDTH) * 0.03,
    color: "#595959",
    fontSize: Fonts.moderateScale(14),
    textAlign: 'left'
  },

  aboutDescriptionTxt: {
    color: "#a9a9a9",
    fontSize: Fonts.moderateScale(14),
    marginLeft: (Metrics.WIDTH) * 0.03,
    marginRight: (Metrics.WIDTH) * 0.03,
    marginBottom: (Metrics.WIDTH) * 0.03,
    textAlign: 'left'
  },

  dividerHorizontal: {
    backgroundColor: "#ebebeb",
    width: (Metrics.WIDTH) * 0.94,
    height: (Metrics.HEIGHT) * 0.001,
    alignSelf: 'center',
    marginBottom: (Metrics.WIDTH) * 0.03
  },

  followerFollwingLikeBg: {
      flexDirection: 'row',
      width: (Metrics.WIDTH) * 0.87,
      alignSelf: 'center',
      marginBottom: (Metrics.WIDTH) * 0.03
  },

  countLabelBg: {
    flexDirection: 'column',
    width: (Metrics.WIDTH) * 0.29,
    justifyContent: 'center'
  },

  countTxt: {
    color: "#363636",
    fontSize: Fonts.moderateScale(16),
    fontFamily: Fonts.type.sfuiDisplayBold,
    textAlign: 'center'
  },

  labelTxt: {
    color: "#959595",
    fontSize: Fonts.moderateScale(12),
    textAlign: 'center'
  },

  divideVertical: {
    backgroundColor: "#d7d7d7",
    width: (Metrics.WIDTH) * 0.003,
    height: (Metrics.HEIGHT) * 0.03,
    alignSelf: 'flex-end',
    marginBottom: (Metrics.HEIGHT) * 0.007
  },

  connectionUserImg: {
    width: (Metrics.WIDTH) * 0.14,
    height: (Metrics.WIDTH) * 0.14,
    borderRadius: (Metrics.WIDTH) * 0.07,
    resizeMode: 'cover'
  },

  connectionSocialIcon: {
    width: (Metrics.WIDTH) * 0.04,
    height: (Metrics.WIDTH) * 0.04,
    alignSelf: 'flex-end',
    marginLeft: -((Metrics.WIDTH) * 0.03)
  },

  photodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: (Metrics.WIDTH) * 0.03
  },

  connectionPhotosTxt: {
    color: "#6f6f6f",
    fontSize: Fonts.moderateScale(15)
  },

  connectionPhotosCountTxt: {
    color: "#b7b7b7",
    fontSize: Fonts.moderateScale(14),
    marginRight: (Metrics.WIDTH) * 0.012
  },

  galleryImg: {
    width: (Metrics.WIDTH) * 0.28,
    height: (Metrics.HEIGHT) * 0.18,
    resizeMode: 'cover'
  },

  rowNameTxt: {
    color: "#363636",
    fontSize: Fonts.moderateScale(15),
    fontFamily: Fonts.type.sfuiDisplayMedium
  },

  rowDesignationTxt: {
    color: "#b7b7b7",
    fontSize: Fonts.moderateScale(12),
    fontFamily: Fonts.type.sfuiDisplayRegular
  },

  profileView:{
    width: Metrics.WIDTH,
    height: (Metrics.HEIGHT) * 0.4,
    backgroundColor: "#2d324f"
  },

  backBottomView:{
    width: Metrics.WIDTH,
    height: (Metrics.HEIGHT) * 0.50,
    backgroundColor: "#e6e6e6"
  },

  contentView:{
    height: (Metrics.HEIGHT) * 0.9,
    position: 'absolute',
    width: Metrics.WIDTH,
    bottom:0
  },

  fbTwitterGoogleLinkedInView:{
    flexDirection: 'row',
    marginTop: (Metrics.WIDTH) * 0.02,
    marginLeft: (Metrics.WIDTH) * 0.03,
    marginRight: (Metrics.WIDTH) * 0.03,
    marginBottom: (Metrics.WIDTH) * 0.04
  },

  fbView:{
    width: (Metrics.WIDTH) * 0.22,
    alignItems: 'center',
    justifyContent: 'center'
  },

  googleImg:{
    height: (Metrics.HEIGHT) * 0.035,
    width: (Metrics.WIDTH) * 0.070,
    resizeMode: 'contain'
  },

  connectTextView:{
    margin: (Metrics.WIDTH) * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  connectCountView:{
    flexDirection: 'row',
    alignItems: 'center'
  },

  connectionImgView:{
    flexDirection: 'row',
    marginLeft: (Metrics.WIDTH) * 0.03,
    marginRight: (Metrics.WIDTH) * 0.03,
    marginTop: (Metrics.WIDTH) * 0.02,
    marginBottom: (Metrics.WIDTH) * 0.04
  },

  connectImg:{
    width: (Metrics.WIDTH) * 0.176,
    flexDirection: 'row'
  },

  photoImgView:{
   flexDirection: 'row',
   margin: (Metrics.WIDTH) * 0.03
  },

  imgView:{
    width: (Metrics.WIDTH) * 0.02,
    height: (Metrics.HEIGHT) * 0.18,
    backgroundColor: Colors.transparent
  },

  socialBg: {
  	width:(Metrics.HEIGHT*0.035),
  	height:(Metrics.HEIGHT*0.035),
  	borderRadius:(Metrics.HEIGHT*0.0175),
  	borderWidth: 1.5,
  	borderColor: Colors.snow,
  	right:(Metrics.WIDTH*0.015),
  	bottom:(Metrics.HEIGHT*0.009),
  	position: 'absolute',
  	alignItems: 'center',
  	justifyContent: 'center'
  },

	rowBg: {
		width: (Metrics.WIDTH) * 0.92,
		alignSelf: 'center' ,
		backgroundColor: Colors.snow,
		marginBottom: (Metrics.HEIGHT) * 0.015,
		justifyContent: 'center',
		/*shadowOffset:{width: 3,  height: 3},
		shadowColor: '#DFDFDF',
		shadowOpacity: 0.5,
		shadowRadius: 2,*/
		elevation: 5
	},
	rowHeaderView:{
		flexDirection: 'row',
		marginTop: (Metrics.HEIGHT) * 0.015,
		width: (Metrics.WIDTH) * 0.84,
		alignSelf: 'center',
	},

	rowHeaderNameView:{
		flexDirection: 'column',
		marginLeft: (Metrics.WIDTH) * 0.03
	},

	rowDescriptionView:{
		width: (Metrics.WIDTH) * 0.84,
		alignSelf: 'center'
	},
	rowTimeTxt: {
		color: "#b7b7b7",
		fontSize: Fonts.moderateScale(14),
		fontFamily: Fonts.type.sfuiDisplayRegular,
		textAlign: 'left'
	},
	rowDescTxt: {
		color: "#6f6f6f",
		fontSize: Fonts.moderateScale(15),
		fontFamily: Fonts.type.sfuiDisplayRegular,
		marginTop: (Metrics.HEIGHT) * 0.015,
		textAlign: 'left'
	},
	profileImgList: {
		width: (Metrics.WIDTH) * 0.12,
		height: (Metrics.WIDTH) * 0.12,
		borderRadius: (Metrics.WIDTH) * 0.06,
		alignSelf: 'flex-start',
	},

});

export default styles;
