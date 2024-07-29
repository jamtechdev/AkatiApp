import { StyleSheet, Dimensions, StatusBar } from 'react-native';

const { height, width } = Dimensions.get('window');

export const Colors = {
    primary: '#18181b',
    secondary: '#dd2476',
    tertiary: '#242424',
    gradient: 'linear-gradient(90deg, rgba(255, 81, 47, 1) 0%, rgba(221, 36, 118, 1) 100%)',
    gradientReverse: 'linear-gradient(180deg, rgba(255, 81, 47, 1) 0%, rgba(221, 36, 118, 1) 100%)',
    black: '#000',
    white: '#fff',
    gray: '#d9d9d9',
    darkGray: '#777777',
    navWidth: 300,
    readingArea: 450,
};





const GlobalStyles = StyleSheet.create({
    fullScreenContainer: {
        height,
        width,
    },
    globalContainer: {
        backgroundColor: Colors.primary,
        flex: 1,
        paddingTop: 45,
        paddingHorizontal: 16,
    },
    textWhite: {
        color: Colors.white,
    },
    textGray: {
        color: Colors.gray,
    },
    inputView: {
        color: Colors.white,
        borderWidth: 1,
        borderColor: Colors.secondary,
        padding: 18,
        paddingHorizontal: 15,
        borderRadius: 50,
        backgroundColor: Colors.tertiary
    },
    btnPrimary: {
        backgroundColor: 'transparent',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 50,
        marginTop: 10
    },
    btnTouchable: {
        backgroundColor: 'transparent',
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.white
    },
    logo: {
        width: 50,
        height: 50,
        marginBottom: 15
    }

});


export default GlobalStyles