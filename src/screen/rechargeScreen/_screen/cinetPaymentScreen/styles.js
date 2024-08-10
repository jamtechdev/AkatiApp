import {StyleSheet} from 'react-native';
import {Colors} from '../../../../_utils/GlobalStyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webview: {
    width: '100%',
    height: '100%',
    alignItems: 'start',
  },
  btn: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#61E786',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  Textstyle: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    width: '90%',
    color: Colors.black,
  },
  lottieStyle: {
    height: 150,
    width: 150,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  webView: {height: '100%', width: '100%'},
  paymentProcessing: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
export default styles;
