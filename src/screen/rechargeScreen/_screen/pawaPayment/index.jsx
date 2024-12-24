import React, {useState, useEffect, useRef} from 'react';
import {Text, View} from 'react-native';
import {WebView} from 'react-native-webview';
import styles from './styles';
import {RowContainer} from '../../../../components';
import {useTranslation} from 'react-i18next';
import { useAppContext } from '../../../../_customContext/AppProvider';
import axios from 'axios';

const PawaPayment = ({route, navigation}) => {
  const {t} = useTranslation();
  const {showToast} = useAppContext()
  const [ammount, setammount] = useState('');
  const [isWebViewLoading, SetIsWebViewLoading] = useState(true);
  const [webviewUrl, setWebviewUrl] = useState('');
  const [isPayProgress, setispayprogress] = useState(true);
  const [accessToken, setAccessToken] = useState('');
  const [coin, setcoin] = useState('coins');
  const paramData = route.params;
  const ref = useRef();
console.log(paramData,"formDatas")
  useEffect(()=>{
    onSubmitPawa(paramData?.formdatas)
  },[])

  const onSubmitPawa = async (formData) => {
    try {
        const response = await axios.post('https://staging.akatibird.com/api/pawapay', formData);
        if (response.data && response.data.redirectUrl) {
            console.log(response.data);
            setWebviewUrl(response.data.redirectUrl)
            // setChoosePaymentMethod("pawa_pay");
          } else {
            navigation.goBack()
            console.log("No redirect URL received")
            showToast("No redirect URL received", "error");
            throw new Error("No redirect URL received");
          }
    } catch (error) {
        console.log(error)
        showToast("Something went wrong", "error");
    }
   
  };


  return (
    <React.Fragment>
    {isPayProgress == false ? (
      <RowContainer style={styles.container}>
        <Text style={styles.Textstyle}>{t('screens.recharge.success')}</Text>
        <Text style={styles.Textstyle}>
          {t('screens.recharge.successfully')}
        </Text>
      </RowContainer>
    ) : (
      <RowContainer style={{flex: 1}}>
        {webviewUrl || !isWebViewLoading ? (
          <View style={styles.webview}>
            <WebView
              style={styles.webView}
              source={{uri: webviewUrl}}
            //   onNavigationStateChange={_onNavigationStateChange}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={false}
            //   onLoadStart={onWebviewLoadStart}
            //   onLoadEnd={() => SetIsWebViewLoading(false)}
            />
          </View>
        ) : (
          <View style={styles.paymentProcessing}>
            <Text style={styles.Textstyle}>
              {t('screens.recharge.process')}
            </Text>
          </View>
        )}
       
      </RowContainer>
    )}
  </React.Fragment>
   
  );
};
export default PawaPayment;
