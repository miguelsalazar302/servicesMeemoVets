import Fonts from './Fonts'
import Metrics from './Metrics'
import Colors from './Colors'
import {Platform} from "react-native";

const colorPrimary = '#51CBBF';

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const ApplicationStyles = {
	// GLOBALS
	justifyContentCenter: {
		justifyContent: 'center',
	},
	alignItemsCenter: {
		alignItems: 'center',
	},
	textAlignCenter: {
		textAlign: 'center',
	},
	textAlignRight: {
		textAlign: 'right',
	},
	textTransformUppercase: {
		textTransform: 'uppercase',
	},
	textGrey: {
		color: '#b7b7b7',
	},
	textBig: {
		fontFamily: Fonts.type.SFUIDisplayThin,
		fontSize: 35,
	},
	// GLOBALS END
	homeDemo: {
		width: Metrics.WIDTH,
	},
	homeDemoImg: {
		width: Metrics.WIDTH,
	},
	menu: {
		hamburguerIcon: {
			color: "#fff"
		},
	},

	chat: {
		sendBtn: {
			color: colorPrimary,
			alignContent: 'center',
			alignSelf: 'center',
			marginRight: 10,
		},
		sendIcon: {
			color: colorPrimary,
			marginBottom: 10,
			marginRight: 10,
		},
	},

	header: {
		main: {
			backgroundColor: "#0e1130",
			borderBottomWidth: 0,
			...Platform.select({
				ios: {
					height: 56
				},
				android: {
					height: 66,
					paddingTop: Metrics.HEIGHT * 0.02
				}
			}),
			elevation: 0,
			paddingLeft: Metrics.WIDTH * 0.05,
			paddingRight: Metrics.WIDTH * 0.05
		},

		left: {
			flex: 0.5,
			backgroundColor: "transparent",
			zIndex: 10000,
		},

		body: {
			flex: 1,
			alignItems: "center"
		},

		right: {
			flex: 0.5
		},

		iconColor: {
			color: "#fff"
		},

		textTitle: {
			color: Colors.snow,
			fontSize: Fonts.moderateScale(20),
			alignSelf: 'center',
			fontFamily:  Fonts.type.helveticaNeueLight,
			// fontFamily: Fonts.type.helveticaNeueLight,
		},


		backArrow: {
			justifyContent: "center",
			alignItems: "center",
			zIndex: 2000,
			/*backgroundColor: 'red',*/
			width: 30,
			height: 200 // @Smell: Revisar. Se exageró el height porque no hacia bien el click en el hamburguer icon del menú
		},
	},
	modal: {
		wrapper: {alignItems: "center", justifyContent: "center"},
		container: {
			backgroundColor: Colors.snow,
			borderRadius: 10,
			width: Metrics.WIDTH * 0.9,
			alignItems: "center",
			paddingVertical: 30
		},

		mainImage: {
			width: Metrics.HEIGHT * 0.2,
			height: Metrics.HEIGHT * 0.2
		},

		title: {
			color: "#000000",
			fontFamily: Fonts.type.sfuiDisplaySemibold,
			fontSize: Fonts.moderateScale(22),
			marginTop: Metrics.HEIGHT * 0.03,
			justifyContent: "center",
			textAlign: "center",
			alignItems: "center",
		},
		subtitle: {
			color: "#000000",
			fontFamily: Fonts.type.sfuiDisplayRegular,
			fontSize: Fonts.moderateScale(14),
			marginTop: 15,
			textAlign: 'center'
		},

		primaryButton: {
			marginTop: 20,
			backgroundColor: "#51CBBF",
			borderRadius: 5,
			paddingVertical: 8,
			paddingHorizontal: Metrics.WIDTH * 0.15
		},

		primaryButtonText: {
			color: "#FFFFFF",
			fontFamily: Fonts.type.sfuiDisplayRegular,
			fontSize: Fonts.moderateScale(14)
		},
	},
	forms: {
		container: {
			backgroundColor: '#737373'
		},
		datePicker: {
			backgroundColor: "#fff",
			borderRadius: (Metrics.WIDTH * 0.42),
			borderWidth: 1,
			borderColor: '#ddd',
			borderStyle: 'solid',
			textAlignVertical: 'top',
			marginTop: 10,
			paddingTop: 10,
			paddingBottom: 10,
			paddingLeft: 15,
			paddingRight: 15,
			textAlign: 'left',
			alignSelf: 'center',
			width: (Metrics.WIDTH * 0.84),
			fontSize: Fonts.moderateScale(16),
			fontFamily: Fonts.type.sfuiDisplayRegular,
			customStyles: {
				dateIcon: {
					position: 'absolute',
					left: 0,
					top: 4,
					marginLeft: 0
				},
				dateInput: {
					marginLeft: 36,
					borderWidth: 0,
				},
				placeholderText: {
					alignSelf: 'flex-start'
				},
				dateText: {
					alignSelf: 'flex-start'
				}
				// ... You can check the source to find the other keys.
			}
		},
		addRowCard: {
			width: (Metrics.WIDTH * 0.84),
			alignSelf: 'center',
			paddingTop: 10
		},
		addRowCardButton: {
			backgroundColor: '#fff',
			width: 50,
			height: 50,
			borderRadius: 50 / 2,
			alignSelf: 'flex-start',
			justifyContent: 'center',
			alignItems: 'center'
		},
		addRowCardButtonIcon: {
			color: '#666'
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
		}
	},
	screen: {
		mainContainer: {
			flex: 1,
			backgroundColor: Colors.transparent
		},
		backgroundImage: {
			position: 'absolute',
			top: 0,
			left: 0,
			bottom: 0,
			right: 0
		},
		container: {
			flex: 1,
			paddingTop: Metrics.baseMargin,
			backgroundColor: Colors.transparent
		},
		section: {
			margin: Metrics.section,
			padding: Metrics.baseMargin
		},
		sectionText: {
			...Fonts.style.normal,
			paddingVertical: Metrics.doubleBaseMargin,
			color: Colors.snow,
			marginVertical: Metrics.smallMargin,
			textAlign: 'center'
		},
		subtitle: {
			color: Colors.snow,
			padding: Metrics.smallMargin,
			marginBottom: Metrics.smallMargin,
			marginHorizontal: Metrics.smallMargin
		},
		titleText: {
			...Fonts.style.h2,
			fontSize: 14,
			color: Colors.text
		}
	},
	darkLabelContainer: {
		padding: Metrics.smallMargin,
		paddingBottom: Metrics.doubleBaseMargin,
		borderBottomColor: Colors.border,
		borderBottomWidth: 1,
		marginBottom: Metrics.baseMargin
	},
	darkLabel: {
		fontFamily: Fonts.type.bold,
		color: Colors.snow
	},
	groupContainer: {
		margin: Metrics.smallMargin,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	sectionTitle: {
		...Fonts.style.h4,
		color: Colors.coal,
		backgroundColor: Colors.ricePaper,
		padding: Metrics.smallMargin,
		marginTop: Metrics.smallMargin,
		marginHorizontal: Metrics.baseMargin,
		borderWidth: 1,
		borderColor: Colors.ember,
		alignItems: 'center',
		textAlign: 'center'
	},
	button: {
		backgroundColor: colorPrimary,
		borderRadius: 20,
		marginTop: 28,
		marginBottom: 28,
		padding: 12,
		alignSelf: 'center',
		flex: 1,
	},
	buttonMapZone: {
		backgroundColor: colorPrimary,
		borderRadius: 20,
		marginTop: 28,
		marginBottom: 28,
		padding: 12,
		alignSelf: 'center',
	},
	buttonFullWidth: {
		width: (Metrics.WIDTH * 0.84),
	},
	buttonDisabled: {
		backgroundColor: colorPrimary,
		borderRadius: 20,
		marginTop: 28,
		marginBottom: 28,
		padding: 12,
		alignSelf: 'center',
		width: (Metrics.WIDTH * 0.84),
		opacity: 0.75
	},
	buttonText: {
		color: Colors.snow,
		alignSelf: 'center',
		textAlign: "center",
		fontSize: Fonts.moderateScale(16),
		fontFamily: Fonts.type.sfuiDisplaySemibold,
	},
	// List Cards
	mainListCardsRowView: {
		marginTop: 10,
	},
	listCardsRow: {
		width: (Metrics.WIDTH) * 0.92,
		alignSelf: 'center',
		backgroundColor: Colors.snow,
		marginBottom: (Metrics.HEIGHT) * 0.015,
		justifyContent: 'center',
		shadowOffset: {width: 3, height: 3},
		shadowColor: '#DFDFDF',
		shadowOpacity: 0.5,
		shadowRadius: 2,
		elevation: 5
	},
	listCardsRowHeaderView: {
		flexDirection: 'row',
		marginTop: (Metrics.HEIGHT) * 0.015,
		width: (Metrics.WIDTH) * 0.84,
		alignSelf: 'center',
	},
	listCardsRowProfileImg: {
		width: (Metrics.WIDTH) * 0.12,
		height: (Metrics.WIDTH) * 0.12,
		borderRadius: (Metrics.WIDTH) * 0.06,
		alignSelf: 'flex-start',
	},
	listCardsRowHeaderNameView: {
		flexDirection: 'column',
		marginLeft: (Metrics.WIDTH) * 0.03
	},
	listCardsRowNameTxt: {
		color: "#6f6f6f",
		fontSize: Fonts.moderateScale(17),
		fontFamily: Fonts.type.sfuiDisplayMedium,
	},

	listCardsRowTimeTxt: {
		color: "#b7b7b7",
		fontSize: Fonts.moderateScale(14),
		fontFamily: Fonts.type.sfuiDisplayRegular,
		textAlign: 'left'
	},

	listCardsRowDescTxt: {
		color: "#6f6f6f",
		fontSize: Fonts.moderateScale(15),
		fontFamily: Fonts.type.sfuiDisplayRegular,
		marginTop: (Metrics.HEIGHT) * 0.015,
		textAlign: 'left'
	},

	listCardsRowMoreIcon: {
		marginTop: -(Metrics.HEIGHT) * 0.015
	},

	listCardsRowDividerHorizontal: {
		width: (Metrics.WIDTH) * 0.95,
		height: 1,
		backgroundColor: "#F2F2F2",
		alignSelf: 'center',
		marginTop: (Metrics.HEIGHT) * 0.022
	},

	listCardsRowDividerVertical: {
		width: (Metrics.WIDTH) * 0.003,
		height: (Metrics.HEIGHT) * 0.04,
		backgroundColor: "#F2F2F2",
		alignSelf: 'flex-end'
	},

	listCardsRowDescriptionView: {
		width: (Metrics.WIDTH) * 0.84,
		alignSelf: 'center'
	},

	listCardsRowLikeCommentShareView: {
		flexDirection: 'row',
		marginTop: (Metrics.HEIGHT) * 0.015,
		marginBottom: (Metrics.HEIGHT) * 0.015,
	},

	listCardsRowShareView: {
		flexDirection: 'row',
		width: (Metrics.WIDTH) * 0.21,
		alignItems: 'center',
		marginLeft: (Metrics.WIDTH) * 0.06
	},

	listCardsRowLikeView: {
		flexDirection: 'row',
		width: (Metrics.WIDTH) * 0.21,
		alignItems: 'center'
	},

	listCardsRowLikeCommentShareText: {
		fontFamily: Fonts.type.sfuiDisplayRegular,
		fontSize: Fonts.moderateScale(15),
		marginLeft: (Metrics.WIDTH) * 0.025,
		color: "#6f6f6f"
	},

	listCardsRowButton: {
		fontFamily: Fonts.type.sfuiDisplayRegular,
		fontSize: Fonts.moderateScale(15),
		marginLeft: (Metrics.WIDTH) * 0.025,
		color: "#fff",
		backgroundColor: colorPrimary,
		borderRadius: 20,
		padding: 12,
		alignSelf: 'center',
		textAlign: 'center'
	},

	listCardsRowCommentView: {
		flexDirection: 'row',
		width: (Metrics.WIDTH) * 0.33,
		alignItems: 'center',
		marginLeft: (Metrics.WIDTH) * 0.06
	},

	listCardsRowLikeCommentShareImage: {
		width: (Metrics.WIDTH) * 0.06,
		height: (Metrics.HEIGHT) * 0.03,
		resizeMode: 'contain'
	},
	webview: {
		height: (Metrics.HEIGHT),
		width: (Metrics.WIDTH),
	},
	datePickerFullScreenContainer: {
		width: (Metrics.WIDTH * 1),
		height: (Metrics.HEIGHT),
	},
	datePicker: {
		width:(Metrics.WIDTH * 1),
		marginBottom: 10,
	},
	datePickerLink: {
		color:'#0691ce',
		fontFamily:'SFUIDisplay-Regular',
		fontSize: 16,
		textAlign: 'center',
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
};

export default ApplicationStyles
