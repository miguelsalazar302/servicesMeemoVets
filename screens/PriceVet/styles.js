import { Platform, StyleSheet, Dimensions } from 'react-native';
import { Fonts, Metrics, Colors } from '../../Themes';


const styles = StyleSheet.create({

    header: {
        borderColor: '#d7d7d7',
        width: Metrics.WIDTH,
        backgroundColor: 'white',
        elevation: 0,
        ...Platform.select({
            ios: {
                borderBottomWidth: 0.1,
            },
            android: {
                borderBottomWidth: 0.3,
                marginTop: 5
            }
        }),
    },
    backArrow: {
        width: 30,
        alignItems: 'center',
    },
    body:{
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title:{
        color: '#6f6f6f',
        fontSize: 18,
        fontFamily: Fonts.type.SFUIDisplaySemibold,
        alignSelf:'center',
        textAlign: 'center'
    },
    right:{
        flex: 1
    },
    left:{
        flex:1
    },

    screenBg: {
        width: Metrics.WIDTH,
        height: Metrics.HEIGHT,
        backgroundColor:'black',
    },

    container:{
        justifyContent:'center' ,
        alignItems:'center',
        backgroundColor: 'white'
    },
    pageContent: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Metrics.HEIGHT*0.13,
    },

    textInputStyleMarginTop: {
        marginTop: Metrics.HEIGHT*0.02,
    },
    textInputStyle: {
        fontFamily: Fonts.type.SFUIDisplayThin,
        color: '#b7b7b7',
        textAlign: 'center',
        fontSize: 35,
        backgroundColor: 'transparent',
        width: Metrics.WIDTH*0.70,
        height: Metrics.HEIGHT*0.10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    darkTextStyle: {
        fontFamily: Fonts.type.SFUIDisplaySemibold,
        textAlign:'center',
        color: '#fff',
        fontSize: 12,
    },

    darkTextStyleBig: {
        fontFamily: Fonts.type.SFUIDisplaySemibold,
        textAlign:'center',
        color: '#fff',
        fontSize: 14,
    },

    lightTextStyle: {
        fontFamily: Fonts.type.SFUIDisplayRegular,
        textAlign:'center',
        color: '#fff',
        fontSize: 12,
        marginTop: Metrics.HEIGHT*0.06,
    },

    buttonStyle: {
        marginTop: Metrics.HEIGHT * 0.05,
        height: (Metrics.HEIGHT * 0.075),
        width: (Metrics.WIDTH * 0.5),
        borderRadius: 40,
        backgroundColor: '#4cd964',
        elevation: 0, // android shadow
    },

    buttonText: {
        width: (Metrics.WIDTH * 0.5),
        textAlign: 'center',
        fontFamily: Fonts.type.SFUIDisplaySemibold,
        color: '#fff',
        fontSize: 16,
    },

});
export default styles;
