import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Platform,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  BottomDrawer,
  Button,
  CustomText,
  HeadingText,
  RowContainer,
  Skeleton,
} from '../../components';
import { Colors } from '../../_utils/GlobalStyle';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, getLanguage, languageSet, updateCoins } from '../../_store/_reducers/auth';
import { commonServices } from '../../_services/common.service';
import { getLanguageCode } from '../../_helpers';
import { useAppContext } from '../../_customContext/AppProvider';
import coin from '../../images/coin-img.png';
import {
  initConnection,
  requestPurchase,
  getProducts,
  endConnection,
  clearTransactionIOS,
} from 'react-native-iap';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../_services/axiosInstance';
import { moderateVerticalScale } from 'react-native-size-matters';
import { freeCreds } from '../../_constant';
import getPaymentMethod, { supportedCountries } from '../../_helpers/payment';
import countryList from 'react-select-country-list'
import CountrySelector from '../../components/CountrySelect';
import axios from 'axios';
import Icons from 'react-native-vector-icons/AntDesign';

export default function RechargeScreen({ navigation }) {
  const dispatch = useDispatch()
  const { email, coins, _id } = useSelector(getAuth)
  const countriesList = useMemo(() => countryList().getData(), [])
  const [rechargePlans, setRechargePlans] = useState();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [country, setCountry] = useState('')
  const [paymentCountry, setPaymentCountry] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isShowCountry, setIsShowCountry] = useState(false)
  const { showToast, showLoader, hideLoader } = useAppContext();
  const { t } = useTranslation();

  const handleCountrySelect = (val) => {
    console.log(val)
    const method = getPaymentMethod(val.label);
    setPaymentCountry(val);
    setCountry(val);
    setPaymentMethods(method);
    setShowModal(true);
    setIsShowCountry(false);
  };

  const itemSubs = [
    'com.akati.ebook.3000.coin',
    'com.akati.ebook.300.coin',
    'com.akati.ebook.200.coin',
    'com.akati.ebook.100.coin',
  ];

  useEffect(() => {
    if (Platform.OS == 'ios' && rechargePlans) {
      initConnection()
        .then(() => {
          const itemSku = rechargePlans.map(plan => plan.ios_device_id)
          getItems(itemSku);
        })
        .catch(err => console.log('Error in establishing IAP connection', err));
    }

    return () => {
      if (Platform.OS == 'ios') {
        endConnection();
      }
    };
  }, [rechargePlans]);

  useEffect(() => {
    commonServices
      .getRechargePlans()
      .then(res => {
        setRechargePlans(res.data.list);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const getItems = async sku => {
    try {
      getProducts({ skus: sku })
        .then(res => {
          // console.log('result', res);
        })
        .catch(err => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetItem = type => {
    if (type == 'paypal') {
      navigation.navigate('PayPalPaymentScreen', {
        coins: selectedPlan.coin_balance,
        rechargeAmount: selectedPlan.recharge_amount,
      });
    } else if (type == 'apple') {
      console.log(typeof selectedPlan.ios_device_id, typeof itemSubs[0]);
      _requestSubscription(selectedPlan.ios_device_id, selectedPlan);
    } else {
      navigation.navigate('CinetPaymentScreen', {
        coins: selectedPlan.coin_balance,
        rechargeAmount: selectedPlan.recharge_amount,
      });
    }
  };

  const handlePawaPay = (val) => {
    // setPaymentLoding(true);
    let result = supportedCountries?.find((item) =>
      item.country.includes(val.label)
    );
    console.log(result, "result................")
    if (result) {
      const formdata = {
        country: result.isoCode,
        customer_email: email,
        amount: (selectedPlan.recharge_amount * 600).toString(),
        coins: selectedPlan.coin_balance.toString(),
        redirectURL: '',
      };
     console.log(formdata, "formdata................")
     if(formdata){
       navigation.navigate('PawaPaymentScreen', { formdatas: formdata });
      }
    }
  };

  const onSubmitPawa = async (formData) => {
    showLoader()
    try {
      console.log(selectedPlan);
      const response = await axios.post(
        "https://staging.akatibird.com/api/pawapay",
        {
          customer_email: formData.customer_email,
          country: formData["country"],
          amount: (selectedPlan.recharge_amount * 600).toString(),
          coins: selectedPlan.coin_balance.toString(),
          redirectURL: '',
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response, "response.......................")
      if (response.data && response.data.redirectUrl) {
        console.log(response.data.redirectUrl);
        navigation.navigate('PawaPaymentScreen', { urlPayment: response.data.redirectUrl });
        // setChoosePaymentMethod("pawa_pay");
      } else {
        hideLoader()
        console.log("No redirect URL received")
        showToast("No redirect URL received", "error");
        throw new Error("No redirect URL received");
      }
    } catch (error) {
      // Handle any errors that occur during the request
      hideLoader()
      showToast(
        error.response?.data?.error?.errorMessage ||
        error.message ||
        "Failed to initiate payment. Please try again.", "error"
      );
    }
  };


  const savePaymentDetails = async (paymentResponse, item) => {
    console.log('...paymentResponse', paymentResponse);
    console.log('...item', item);
    const body = {
      coins: item?.coin_balance,
      transaction_id: paymentResponse?.transactionId,
      amount: item?.recharge_amount,
      currency: 'EUR',
      status: 'VERIFIED',
      json: JSON.stringify(paymentResponse),
      payment_method: 'APPLE_PAY'
    };

    console.log('body', JSON.stringify(body));
    const { data } = await axiosInstance
      .post('PaypalTransactionHistory', body)
      .catch(err => {
        console.log('Error when updating payment history api:', err);
      });
    console.log('updating payment history', data);
    if (data.success) {
      showToast('Your Payment is done');
    } else {
      showToast('Something went wrong.', 'error');
    }
  };

  const _requestSubscription = async (sku, item) => {
    try {
      await clearTransactionIOS();
      showLoader();
      const data = await requestPurchase({
        sku,
        flushFailedPurchasesCachedAsPendingAndroid: true,
      });
      console.log('data', data);
      if (data?.transactionId) {
        savePaymentDetails(data, item);
      }
    } catch (err) {
      if (err.code === 'E_USER_CANCELLED') {
        showToast('Purchase is canceled by you', 'error');
      } else {
        showToast(JSON.stringify(err?.message, null, 2), 'error');
        console.warn(err.code, err.message);
      }
    } finally {
      hideLoader();
    }
  };

  const renderRechargeItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Image source={coin} style={styles.image} />
        <View>
          <CustomText
            style={{ fontWeight: 700, fontSize: 16, color: Colors.secondary }}>
            {item?.coin_balance} Coins
          </CustomText>
        </View>
        <CustomText style={{ fontWeight: 500, fontSize: 14 }}>
          € {item?.recharge_amount}
        </CustomText>
        <CustomText style={{ fontWeight: 500, fontSize: 14 }}>
          {item?.recharge_amount * 600} FCFA
        </CustomText>
        <Button
          onPress={() => {
            if (freeCreds.email == email && freeCreds._id == _id) {
              dispatch(updateCoins(coins + item?.coin_balance))
            } else {
              setSelectedPlan(item);
              setIsShowCountry(true)
            }
          }}
          title={t('screens.recharge.addCoin') + ' Coin'}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 5,
            // width:'0%',
          }}
          textStyle={{
            fontSize: 12,
          }}
        />
      </View>
    );
  };

  return (
    <RowContainer>
      <View style={{ paddingBottom: 20 }}>
        <HeadingText>{t('screens.recharge.recharge')}</HeadingText>
      </View>
      {!rechargePlans ? (
        <Skeleton isLoading={true} numColumns={2} isCard />
      ) : rechargePlans.length == 0 ? (
        <CustomText>{t('screens.history.notfound')}</CustomText>
      ) : (
        <FlatList
          data={rechargePlans}
          renderItem={renderRechargeItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
        />
      )}
      {showModal && (
        <BottomDrawer
          visible={showModal}
          onClose={() => setShowModal(false)}
          title={t('screens.recharge.completePayment')}
          style={{ height: '28%' }}>
          <View style={{ width: '100%', paddingVertical: 25, gap: 10 }}>
            {Platform.OS == 'ios' ? (
              <View>
                <Button
                  onPress={() => {
                    setShowModal(false);
                    handleGetItem('apple');
                  }}
                  title={'Apple Pay'}
                />
              </View>
            ) : (
              <View>
                {paymentMethods.includes('paypal') && (
                  <Button
                    onPress={() => {
                      setShowModal(false);
                      handleGetItem('paypal');
                    }}
                    title={t('screens.recharge.withPaypal')}
                  />
                )}
                {paymentMethods.includes('cinetpay') && (
                  <Button
                    title={t('screens.recharge.withCinetpay')}
                    onPress={() => {
                      setShowModal(false);
                      handleGetItem('CinetPay');
                    }}
                    style={{ backgroundColor: '#28a745' }}
                    gradient={false}
                  />
                )}
                {paymentMethods.includes('pawapay') && (
                  <Button
                    title={'With PawaPay'}
                    onPress={() => {
                      setShowModal(false);
                      // handleGetItem('PawaPay');
                      handlePawaPay(country)
                    }}
                    style={{ backgroundColor: '#8363e2' }}
                    gradient={false}
                  />
                )}
              </View>
            )}
          </View>
        </BottomDrawer>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShowCountry}>
        <View style={styles.centeredView}>
          <Pressable onPress={()=>setIsShowCountry(false)}><Icons name='closecircleo' size={30} color={Colors.gradient}/></Pressable>
          <View style={styles.modalView}>
            <CountrySelector onSelectCountry={handleCountrySelect} />
          </View>
        </View>
      </Modal>
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.tertiary,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  card: {
    marginRight: 10,
    width: '45%',
    height: 190,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    gap: 5,
    overflow: 'hidden',
    borderColor: Colors.secondary,
    backgroundColor: Colors.tertiary,
    marginVertical: 10,
    paddingTop: moderateVerticalScale(15),
  },
  row: {
    justifyContent: 'space-between',
  },
  image: {
    width: 40,
    height: 40,
  },
});
