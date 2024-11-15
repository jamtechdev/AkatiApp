import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Checkbox,
  CustomText,
  HeadingText,
  RowContainer,
  Skeleton,
  TouchableText,
} from '../../components';
// import {Colors} from '../../_utils/GlobalStyle';
import {useDispatch, useSelector} from 'react-redux';
import {getAuth, getLanguage, languageSet} from '../../_store/_reducers/auth';
import {commonServices} from '../../_services/common.service';
import {getLanguageCode} from '../../_helpers';
import {useAppContext} from '../../_customContext/AppProvider';
import coin from '../../images/coin-img.png';
import {useFocusEffect} from '@react-navigation/native';
import NoDataFound from '../../components/NoDataFound';
import {useTranslation} from 'react-i18next';
import {Colors} from '../../_utils/GlobalStyle';

export default function RechargeHistoryScreen() {
  const {showToast, showLoader, hideLoader} = useAppContext();
  const [histories, setHistories] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const {t} = useTranslation();

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

  const renderHistoriesItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedHistory(item);
          setIsModalVisible(true);
        }}>
        <View style={styles.ListContainer}>
          <View style={styles.innerContainer}>
            <Image source={coin} style={styles.image} />
            <View>
              <CustomText style={{fontWeight: 700}}>
                {item?.coins} {t('screens.history.coin')}
              </CustomText>
              <CustomText>
                {new Date(item?.created_at).toLocaleString()}
              </CustomText>
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
          <CustomText style={{marginRight: 10, color: Colors.secondary}}>
            €{item?.amount}
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <RowContainer>
      <View style={{paddingBottom: 20}}>
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
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Transaction Details</Text>
              <TouchableOpacity 
                style={styles.closeIconButton}
                onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeIcon}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('screens.history.status')}</Text>
                <Text style={[styles.detailValue, styles.statusText]}>COMPLETED</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('screens.history.amount')}</Text>
                <Text style={styles.detailValue}>€{selectedHistory?.amount}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('screens.history.coin')}</Text>
                <Text style={styles.detailValue}>{selectedHistory?.coins}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('screens.history.date')}</Text>
                <Text style={styles.detailValue}>
                  {new Date(selectedHistory?.created_at).toLocaleString()}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('screens.history.paymentMethod')}</Text>
                <Text style={styles.detailValue}>{selectedHistory?.payment_method}</Text>
              </View>

              <View style={[styles.detailRow, {flexDirection: 'column', alignItems: 'flex-start'}]}>
                <Text style={styles.detailLabel}>{t('screens.history.transactionid')}</Text>
                <Text style={[styles.detailValue, {marginTop: 5}]}>{selectedHistory?.transaction_id}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: Colors.primary,
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
  },
  closeIconButton: {
    padding: 5,
  },
  closeIcon: {
    fontSize: 28,
    color: Colors.white,
    fontWeight: 'bold',
  },
  detailsContainer: {
    backgroundColor: Colors.tertiary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  detailLabel: {
    fontSize: 16,
    color: Colors.gray,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500',
  },
  statusText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
