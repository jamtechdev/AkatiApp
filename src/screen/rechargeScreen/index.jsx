import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Platform,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  BottomDrawer,
  Button,
  CustomText,
  HeadingText,
  RowContainer,
  Skeleton,
} from '../../components';
import {Colors} from '../../_utils/GlobalStyle';
import {useDispatch, useSelector} from 'react-redux';
import {getAuth, getLanguage, languageSet} from '../../_store/_reducers/auth';
import {commonServices} from '../../_services/common.service';
import {getLanguageCode} from '../../_helpers';
import {useAppContext} from '../../_customContext/AppProvider';
import coin from '../../images/coin.png';
import {
  initConnection,
  requestPurchase,
  getProducts,
  endConnection,
  clearTransactionIOS,
} from 'react-native-iap';

export default function RechargeScreen({navigation}) {
  const [rechargePlans, setRechargePlans] = useState();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const {showToast, showLoader, hideLoader} = useAppContext();

  const itemSubs = [
    'com.akati.ebook.60.coin',
    'com.akati.ebook.300.coin',
    'com.akati.ebook.200.coin',
    'com.akati.ebook.100.coin',
  ];

  useEffect(() => {
    initConnection()
      .then(() => {
        // console.log('IAP connection established');
        getItems();
      })
      .catch(err => console.log('Error in establishing IAP connection', err));

    return () => {
      endConnection();
    };
  }, []);

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

  const getItems = async () => {
    try {
      getProducts({skus: itemSubs})
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
      _requestSubscription(
        `com.akati.ebook.${selectedPlan.coin_balance}.coin`,
        selectedPlan,
      );
    } else {
      navigation.navigate('CinetPaymentScreen', {
        coins: selectedPlan.coin_balance,
        rechargeAmount: selectedPlan.recharge_amount,
      });
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

  const renderRechargeItem = ({item}) => {
    return (
      <View style={styles.card}>
        <Image source={coin} style={styles.image} />
        <View>
          <CustomText
            style={{fontWeight: 700, fontSize: 16, color: Colors.secondary}}>
            {item?.coin_balance} Coins
          </CustomText>
        </View>
        <CustomText style={{fontWeight: 500, fontSize: 14}}>
          €{item?.recharge_amount}
        </CustomText>
        <Button
          onPress={() => {
            setSelectedPlan(item);
            setShowModal(true);
          }}
          title={'Buy Now'}
          style={{
            paddingHorzontal: 25,
            paddingVertical: 5,
            width: 80,
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
      <View style={{paddingBottom: 20}}>
        <HeadingText>Recharge</HeadingText>
      </View>
      {!rechargePlans ? (
        <Skeleton isLoading={true} numColumns={2} isCard />
      ) : rechargePlans.length == 0 ? (
        <CustomText> No data Found</CustomText>
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
          title={'Select Payment Method '}
          style={{height: '28%'}}>
          <View style={{width: '100%', paddingVertical: 25, gap: 10}}>
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
                <Button
                  onPress={() => {
                    setShowModal(false);
                    handleGetItem('paypal');
                  }}
                  title={'Pay with PayPal'}
                />
                <Button
                  title={'Pay with CinetPay'}
                  onPress={() => {
                    setShowModal(false);
                    handleGetItem('CinetPay');
                  }}
                  style={{backgroundColor: '#28a745'}}
                  gradient={false}
                />
              </View>
            )}
          </View>
        </BottomDrawer>
      )}
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: 10,
    width: '45%',
    height: 180,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    gap: 5,
    overflow: 'hidden',
    borderColor: Colors.secondary,
    backgroundColor: Colors.tertiary,
    marginVertical: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  image: {
    width: 70,
    height: 70,
  },
});
