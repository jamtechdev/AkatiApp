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
export default function RechargeScreen() {
  const [rechargePlans, setRechargePlans] = useState();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [choosePaymentMethod, setChoosePaymentMethod] = useState(null);

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

  const renderRechargeItem = ({item}) => {
    return (
      <View style={styles.card}>
        <Image source={coin} style={styles.image} />
        <View>
          <CustomText>{item?.coin_balance} Coins</CustomText>
        </View>
        <CustomText>€{item?.recharge_amount}</CustomText>
      </View>
    );
  };

  return (
    <RowContainer>
    <View style={{ paddingBottom: 20}}>
     <HeadingText>Recharge</HeadingText>
    </View>
      {!rechargePlans ? (
        <CustomText> Loading</CustomText>
      ) : rechargePlans.length == 0 ? (
        <CustomText> No data Found</CustomText>
      ) : (
        <FlatList
          data={rechargePlans}
          renderItem={renderRechargeItem}
          keyExtractor={(item, index) => index}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
        />
      )}
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: 10,
    width: '45%',
    height: 150,
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
