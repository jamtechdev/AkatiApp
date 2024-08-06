import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Checkbox,
  CustomText,
  HeadingText,
  RowContainer,
  Skeleton,
  TouchableText,
} from '../../components';
import {Colors} from '../../_utils/GlobalStyle';
import {useDispatch, useSelector} from 'react-redux';
import {getAuth, getLanguage, languageSet} from '../../_store/_reducers/auth';
import {commonServices} from '../../_services/common.service';
import {getLanguageCode} from '../../_helpers';
import {useAppContext} from '../../_customContext/AppProvider';
import coin from '../../images/coin.png';
import { useFocusEffect } from '@react-navigation/native';
export default function RechargeHistoryScreen() {
  const {showToast, showLoader, hideLoader} = useAppContext();
  const [histories, setHistories] = useState();

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, []),
  );

  const fetchHistory = ()=>{
    commonServices
    .getTransactionHistory()
    .then(res => {
      setHistories(res.data.list);
    })
    .catch(err => console.log(err.message));
  }

  const renderHistoriesItem = ({item}) => {
    return (
      <View style={styles.ListContainer}>
        <View style={styles.innerContainer}>
          <Image source={coin} style={styles.image} />
          <View>
            <CustomText style={{fontWeight: 700}}>
              {item?.coins} Coins
            </CustomText>
            {/* <CustomText>{new Date(item?.created_at).toLocaleString()}</CustomText> */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CustomText style={{fontSize: 12, color: Colors.gray}}>
                TXN ID :{' '}
              </CustomText>
              <CustomText style={{fontSize: 12}}>
                {item?.transaction_id}{' '}
              </CustomText>
            </View>
          </View>
        </View>
        <CustomText style={{marginRight: 10, color: Colors.secondary}}>
          €{item?.amount}
        </CustomText>
      </View>
    );
  };

  return (
    <RowContainer>
      <View style={{paddingBottom: 20}}>
        <HeadingText>Recharge History</HeadingText>
      </View>
      {!histories ? (
        <Skeleton isLoading={true} isList/>
      ) : histories.length == 0 ? (
        <CustomText> No data Found</CustomText>
      ) : (
        <FlatList
          data={histories}
          renderItem={renderHistoriesItem}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    width: 70,
    height: 70,
  },
});
