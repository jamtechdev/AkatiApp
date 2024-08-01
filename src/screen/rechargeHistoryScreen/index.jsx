import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Checkbox,
  CustomText,
  HeadingText,
  RowContainer,
  TouchableText,
} from '../../components';
import {Colors} from '../../_utils/GlobalStyle';
import {useDispatch, useSelector} from 'react-redux';
import {getAuth, getLanguage, languageSet} from '../../_store/_reducers/auth';
import {commonServices} from '../../_services/common.service';
import {getLanguageCode} from '../../_helpers';
import {useAppContext} from '../../_customContext/AppProvider';
import coin from '../../images/coin.png';
export default function RechargeHistoryScreen() {
  const {showToast, showLoader, hideLoader} = useAppContext();
  const [histories, setHistories] = useState();
  useEffect(() => {
    commonServices
      .getTransactionHistory()
      .then(res => {
        setHistories(res.data.list);
      })
      .catch(err => console.log(err.message));
  }, []);

  const renderHistoriesItem = ({item}) => {
    return (
      <View style={styles.ListContainer}>
        <Image source={coin} style={styles.image} />
        <View>
        <CustomText>{item?.coins} Coins</CustomText>
        {/* <CustomText>{new Date(item?.created_at).toLocaleString()}</CustomText> */}
        </View>
        <View>
        <CustomText>Transaction ID :  </CustomText>
        <CustomText>{item?.transaction_id} </CustomText>
        </View>
        <CustomText>€{item?.amount}</CustomText>
      </View>
    );
  };

  return (
    <RowContainer>
        <View style={{ paddingBottom: 20}}>
     <HeadingText>Recharge History</HeadingText>
    </View>
      {!histories ? (
        <CustomText> Loading</CustomText>
      ) : histories.length == 0 ? (
        <CustomText> No data Found</CustomText>
      ) : (
        <FlatList
          data={histories}
          renderItem={renderHistoriesItem}
          keyExtractor={(item, index) => index}
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
  },
  image: {
    width: 70,
    height: 70,
  },
});
