import React, {useState, useEffect, useRef} from 'react';
import {Text, View, Alert} from 'react-native';
import {WebView} from 'react-native-webview';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import LottieView from 'lottie-react-native';
import {payment_done} from '../../config/images';
// import CoinLoader from '../../components/CoinLoader';
import styles from './styles';
import {
  CINETPAY_API_ID,
  CINETPAY_SITE_ID,
  RETURN_URL,
} from '../../_constant/Config';
import axiosInstance from '../../_services/axiosInstance';
import {useSelector} from 'react-redux';
import {getAuth} from '../../_store/_reducers/auth';

const CinetPaymentScreen = ({route, navigation}) => {
  const [ammount, setammount] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [paymentToken, setPaymentToken] = useState('');
  const [transactionId, setTransactionId] = useState();
  const [isWebViewLoading, SetIsWebViewLoading] = useState(true);
  const [paypalUrl, setPaypalUrl] = useState('');
  // const [token, setToken] = useState('');
  const [isPayProgress, setispayprogress] = useState(true);
  const [accessToken, setAccessToken] = useState('');
  const [coin, setcoins] = useState('coins');
  const [shouldShowWebViewLoading, setShouldShowWebviewLoading] =
    useState(true);
  const {coins, rechargeAmount} = route.params;
  const ref = useRef();
  const {token} = useSelector(getAuth);

  useEffect(() => {
    _retrieveData();
  }, []);

  const _retrieveData = async () => {
    try {
      if (rechargeAmount !== null) {
        setcoins(coins);
        // setToken(token);
        setAccessToken('');
        buyPlan(rechargeAmount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const buyPlan = async => {
    const trans_id = 'cinet_pay_' + Date.now();
    const amount = rechargeAmount * 610;
    setTransactionId(trans_id);
    setammount(amount);
    const dataDetail = {
      apikey: CINETPAY_API_ID,
      site_id: CINETPAY_SITE_ID,
      transaction_id: trans_id,
      amount: amount,
      currency: 'XAF',
      description: 'TEST INTEGRATION ',
      return_url: `${RETURN_URL}success`,
      notify_url: `${RETURN_URL}success`,
      channels: 'ALL',
      lang: 'en',
      mode: 'PRODUCTION',
    };
    axiosInstance
      .post(`https://api-checkout.cinetpay.com/v2/payment`, dataDetail, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        const {data} = response.data;
        setPaymentToken(data.payment_token);
        setPaypalUrl(data.payment_url);
        // console.log('response providing links', response.data, paymentToken);
      })
      .catch(err => {
        console.log({...err});
      });
  };

  savePaymentDetails = async paymentResponse => {
    const body = {
      coins: coins,
      transaction_id: transactionId,
      amount: ammount,
      currency: paymentResponse?.data?.currency,
      status: paymentResponse?.data?.status,
      json: JSON.stringify(paymentResponse),
    };

    // console.log('body', JSON.stringify(body));
    const {data} = await axiosInstance
      .post('PaypalTransactionHistory', body)
      .catch(err => {
        console.log('Error when updating payment history api:', err);
      });
    // console.log('updating payment history', data);
    if (data.success) {
      setispayprogress(false);
      // resetCoins(response.data.coins);
      ref.current.play();
      setTimeout(() => {
        props.navigation.goBack();
      }, 2000);
    } else {
      alert('Something went wrong.');
      props.navigation.goBack();
    }
  };

  const checkPaymentProcess = () => {
    const formdata = new FormData();
    formdata.append('apikey', '695644265ece900561f2c6.42532258');
    formdata.append('site_id', '454000');
    formdata.append('transaction_id', transactionId);
    // console.log(formdata, transactionId, typeof transactionId);
    const requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };
    fetch('https://api-checkout.cinetpay.com/v2/payment/check', requestOptions)
      .then(response => response.json())
      .then(response => {
        // console.log(response, 'hello ', response);
        setShouldShowWebviewLoading(true);
        // console.log('payment response', response.data);
        if (response.code == '00') {
          savePaymentDetails(response);
        } else {
          Alert.alert(
            'Payment Status',
            "Your payment wasn't completed" + 'status :' + response?.message,
          );
          return props.navigation.goBack();
        }
      })
      .catch(err => {
        setShouldShowWebviewLoading(true);
        console.log({...err});
      });
  };

  onWebviewLoadStart = () => {
    if (shouldShowWebViewLoading) {
      SetIsWebViewLoading(true);
    }
  };

  _onNavigationStateChange = webViewState => {
    // console.log('webViewState', webViewState);
    setShowInfo(false);
    if (webViewState.title == '') {
      setShouldShowWebviewLoading(false);
    }
    if (webViewState.url.includes('status')) {
      setShowInfo(true);
    }
    if (webViewState.url.includes(`${RETURN_URL}failed`)) {
      setShowInfo(false);
      return props.navigation.goBack();
    }
    if (webViewState.url.includes(`${RETURN_URL}success`)) {
      setShowInfo(false);
      setPaypalUrl(null);
      checkPaymentProcess();
    }
  };
  const handleWebViewMessage = event => {
    console.log('WebView message:', event.nativeEvent.data);
  };

  return (
    <React.Fragment>
      {isPayProgress == false ? (
        <View style={styles.container}>
          <Text style={styles.Textstyle}>Success !</Text>
          <Text style={styles.Textstyle}>Payment done successfully.</Text>
          {/* <LottieView
            style={styles.lottieStyle}
            ref={ref}
            source={payment_done}
            loop={false}
          /> */}
        </View>
      ) : (
        <View style={{flex: 1}}>
          {paypalUrl || !isWebViewLoading ? (
            <View style={[styles.webview, {height: '90%'}]}>
              {showInfo && (
                <View
                  style={{
                    backgroundColor: '#ff0000',
                    paddingVertical: 15,
                    paddingLeft: 25,
                    // paddingHorizontal: 10
                  }}>
                  <Text
                    style={{fontSize: 18, fontWeight: 'bold', color: '#fff'}}>
                    Please don't go back during payment is inProcess.
                  </Text>
                </View>
              )}
              <WebView
                style={styles.webView}
                source={{uri: paypalUrl}}
                onNavigationStateChange={this._onNavigationStateChange}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                webviewDebuggingEnabled={true}
                startInLoadingState={false}
                onLoadStart={onWebviewLoadStart}
                onMessage={handleWebViewMessage}
                onLoadEnd={() => SetIsWebViewLoading(false)}
              />
            </View>
          ) : (
            <View style={styles.paymentProcessing}>
              <Text style={styles.Textstyle}>
                Please wait while we are processing ...
              </Text>
              {/* <CoinLoader /> */}
            </View>
          )}
          {isWebViewLoading ? (
            <View style={styles.paymentProcessing}>
              <Text style={styles.Textstyle}>
                Redirecting to CinetPay payment page ...
              </Text>
              {/* <CoinLoader /> */}
            </View>
          ) : null}
        </View>
      )}
    </React.Fragment>
  );
};

export default CinetPaymentScreen;
