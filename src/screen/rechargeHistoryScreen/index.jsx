import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Checkbox,
  CustomText,
  HeadingText,
  RowContainer,
  Skeleton,
  TouchableText,
} from '../../components';
// import {Colors} from '../../_utils/GlobalStyle';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, getLanguage, languageSet } from '../../_store/_reducers/auth';
import { commonServices } from '../../_services/common.service';
import { getLanguageCode } from '../../_helpers';
import { useAppContext } from '../../_customContext/AppProvider';
import coin from '../../images/coin-img.png';
import { useFocusEffect } from '@react-navigation/native';
import NoDataFound from '../../components/NoDataFound';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../_utils/GlobalStyle';

export default function RechargeHistoryScreen() {
  const { showToast, showLoader, hideLoader } = useAppContext();
  const [histories, setHistories] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, []),
  );

  const fetchHistory = () => {
    commonServices
      .getTransactionHistory()
      .then(res => {
        setHistories(res.data.list);
      })
      .catch(err => console.log(err.message));
  };

  const renderHistoriesItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => {
        setSelectedHistory(item);
        setIsModalVisible(true);
      }}>
        <View style={styles.ListContainer}>
          <View style={styles.innerContainer}>
            <Image source={coin} style={styles.image} />
            <View>
              <CustomText style={{ fontWeight: 700 }}>
                {item?.coins} {t('screens.history.coin')}
              </CustomText>
              <CustomText>{new Date(item?.created_at).toLocaleString()}</CustomText>
              {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CustomText style={{fontSize: 12, color: Colors.gray}}>
                  TXN ID :{' '}
                </CustomText>
                <CustomText style={{fontSize: 12}}>
                  {item?.transaction_id}{' '}
                </CustomText> */}
              {/* </View> */}
            </View>
          </View>
          <CustomText style={{ marginRight: 10, color: Colors.secondary }}>
            €{item?.amount}
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <RowContainer>
      <View style={{ paddingBottom: 20 }}>
        <HeadingText>{t('screens.history.history')}</HeadingText>
      </View>
      {!histories ? (
        <Skeleton isLoading={true} isList />
      ) : histories.length == 0 ? (
        <NoDataFound description={t('screens.history.notfound')} />
      ) : (
        <FlatList
          data={histories}
          renderItem={renderHistoriesItem}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
        />
      )}
     <Modal
  animationType="slide"
  transparent={true}
  visible={isModalVisible}
  onRequestClose={() => setIsModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.title}>Transaction Details</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>{t('screens.history.amount')}: €{selectedHistory?.amount}</Text>
        <Text style={styles.detailText}>{t('screens.history.coin')}: {selectedHistory?.coins}</Text>
        <Text style={styles.detailText}>{t('screens.history.transactionid')}: {selectedHistory?.transaction_id}</Text>
        <Text style={styles.detailText}>
         {t('screens.history.date')}: {new Date(selectedHistory?.created_at).toLocaleString()}
        </Text>
        <Text style={styles.detailText}>{t('screens.history.paymentMethod')}: {selectedHistory?.payment_method}</Text>
        <Text style={styles.detailText}>{t('screens.history.status')}: COMPLETED</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
          Close
        </Text>
      </View>
    </View>
  </View>
</Modal>

    </RowContainer>
  );
}

const styles = StyleSheet.create({
  ListContainer: {
    height: 70,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: Colors.secondary,
    backgroundColor: Colors.tertiary,
    paddingHorizontal: 5,
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  image: {
    width: 40,
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  modalContainer: {
    width: '80%',
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 10,
    alignItems: 'flex-start', // aligns details to the left
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: Colors.white,
    alignSelf: 'center', // centers title text
  },
  detailsContainer: {
    alignSelf: 'stretch',
    marginBottom: 20,
    marginVertical: 15,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: 12,
    borderColor: Colors.secondary
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.white,
  },
  footer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  closeButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    paddingVertical: 10, 
    paddingHorizontal: 25,
    borderRadius: 25,
    backgroundColor: Colors.secondary
  },
});
