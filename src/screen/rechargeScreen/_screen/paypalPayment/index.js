import React, { useState, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import styles from './styles';
import { auth, PAYMENT_URL, RETURN_URL } from '../../../../_constant/Config';
import axiosInstance from '../../../../_services/axiosInstance';
import { RowContainer } from '../../../../components';

const PaypalPayment = ({ route, navigation }) => {
  const [ammount, setammount] = useState('');
  const [isWebViewLoading, SetIsWebViewLoading] = useState(true);
  const [paypalUrl, setPaypalUrl] = useState('');
  const [isPayProgress, setispayprogress] = useState(true);
  const [accessToken, setAccessToken] = useState('');
  const [coin, setcoin] = useState('coins');
  const { coins, rechargeAmount } = route.params;
  const ref = useRef();

  useEffect(() => {
    _retrieveData();
  }, []);
  const _retrieveData = async () => {
    try {
      if (rechargeAmount !== null) {
        setcoin(coins);
        setammount(rechargeAmount);
        setAccessToken('');
        buyPlan(rechargeAmount);
      }
    } catch (error) {
      alert(error);
    }
  };
  const savePaymentDetails = async paymentResponse => {
    const body = {
      coins: coins,
      transaction_id:
        paymentResponse.data.transactions[0].related_resources[0].sale.id,
      amount: ammount,
      currency: paymentResponse.data.transactions[0].amount.currency,
      status: JSON.stringify(paymentResponse.data.payer.status),
      json: JSON.stringify(paymentResponse),
    };

    // console.log('body', JSON.stringify(body));
    const { data } = await axiosInstance
      .post('PaypalTransactionHistory', body)
      .catch(err => {
        console.log('Error when updating payment history api:', err);
      });
    // console.log('updating payment history', data);
    if (data.success) {
      setispayprogress(false);
      // resetCoins(response.data.coins);
      // ref.current.play();
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } else {
      alert('Something went wrong.');
      navigation.goBack();
    }
  };
  // on payment success
  const [shouldShowWebViewLoading, setShouldShowWebviewLoading] =
    useState(true);
  /*---Paypal checkout section---*/
  const buyPlan = async ammount => {
    ammount = JSON.parse(ammount);

    const dataDetail = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      transactions: [
        {
          amount: {
            currency: 'EUR',
            total: ammount,
          },
          description: 'This is the payment transaction description',
          payment_options: {
            allowed_payment_method: 'IMMEDIATE_PAY',
          },
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      },
      redirect_urls: {
        return_url: `${RETURN_URL}success`,
        cancel_url: `${RETURN_URL}failed`,
      },
    };

    const clientId = auth.Username;
    const clientSecret = auth.Password;
    const authHeader = 'Basic ' + btoa(`${clientId}:${clientSecret}`);
    axios
      .post(
        `${PAYMENT_URL}v1/oauth2/token`,
        { grant_type: 'client_credentials' },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: authHeader, // your Authorization value you get from postman api hit
          },
        },
      )
      .then(response => {
        setAccessToken(response.data.access_token);
        createPayment(response.data.access_token, ammount);
      })
      .catch(err => {
        console.log(err, 'main');
      });
  };

  const createPayment = async (accessToken, amount) => {
    try {
      const response = await axios.post(
        `${PAYMENT_URL}v1/payments/payment`,
        {
          intent: 'sale',
          redirect_urls: {
            return_url: 'https://feupsontec.com/payment/success',
            cancel_url: 'https://feupsontec.com/payment/failed',
          },
          transactions: [
            {
              amount: {
                total: amount,
                currency: 'EUR',
              },
              description: 'This is the payment transaction description.',
            },
          ],
          payer: {
            payment_method: 'paypal',
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const { links } = response.data;
      const approvalUrl = links.find(data => data.rel == 'approval_url').href;
      setPaypalUrl(approvalUrl);
    } catch (error) {
      console.error(
        'Error creating payment:',
        error.response ? error.response.data : error.message,
      );
    }
  };

  /*---End Paypal checkout section---*/
  const onWebviewLoadStart = () => {
    if (shouldShowWebViewLoading) {
      SetIsWebViewLoading(true);
    }
  };
  const _onNavigationStateChange = webViewState => {
    if (webViewState.title == '') {
      setShouldShowWebviewLoading(false);
    }
    if (webViewState.url.includes(`${RETURN_URL}failed`)) {
      return navigation.goBack();
    }
    if (webViewState.url.includes(`https://feupsontec.com/payment/success`)) {
      setPaypalUrl(null);
      const urlArr = webViewState.url.split(/(=|&)/);
      const paymentId = urlArr[2];
      const payerId = urlArr[10];
      axios
        .post(
          `${PAYMENT_URL}v1/payments/payment/${paymentId}/execute`,
          { payer_id: payerId },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .then(response => {
          setShouldShowWebviewLoading(true);
          console.log(
            'payment transaction id',
            response.data.transactions[0].related_resources[0].sale.id,
          );
          if (response.data.state == 'approved') {
            savePaymentDetails(response);
          } else {
            alert("Your payment wasn't completed");
          }
        })
        .catch(err => {
          setShouldShowWebviewLoading(true);
          console.log({ ...err });
        });
    }
  };

  return (
    <React.Fragment>
      {isPayProgress == false ? (
        <RowContainer style={styles.container}>
          <Text style={styles.Textstyle}>Success !</Text>
          <Text style={styles.Textstyle}>Payment done successfully.</Text>
        </RowContainer>
      ) : (
        <RowContainer style={{ flex: 1 }}>
          {paypalUrl || !isWebViewLoading ? (
            <View style={styles.webview}>
              <WebView
                style={styles.webView}
                source={{ uri: paypalUrl }}
                onNavigationStateChange={_onNavigationStateChange}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={false}
                onLoadStart={onWebviewLoadStart}
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
            // <View style={styles.paymentProcessing}>
            //   <Text style={styles.Textstyle}>
            //     Please wait while we are processing ...
            //   </Text>
            //   {/* <CoinLoader /> */}
            // </View>
          )}
          {/* {isWebViewLoading ? (
            <View style={styles.paymentProcessing}>
              <Text style={styles.Textstyle}>
                Redirecting to payment page ...
              </Text>

            </View>
          ) : null} */}
        </RowContainer>
      )}
    </React.Fragment>
  );
};
export default PaypalPayment;
