import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {CustomText, HeadingText, RowContainer} from '../../components';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../_utils/GlobalStyle';
export default function ReviewScreen() {
  const stars = Array(5).fill('star-outline');
  return (
    <RowContainer style={styles.container}>
      <ScrollView>
        <HeadingText>Reviews & Ratings</HeadingText>
        <View>
          <CustomText style={styles.totalRate}>3.5</CustomText>
          <View>
            <View style={styles.starView}>
              {stars.map((star, index) => (
                <Icon key={index} name={star} size={25} />
              ))}
            </View>
            <CustomText style={styles.rateText}>Based on 14 ratings</CustomText>
          </View>
        </View>
      </ScrollView>
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  totalRate: {
    color: Colors.secondary,
    fontSize: 30,
  },
  rateText: {
    color: Colors.darkGray,
  },
  starView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
    marginVertical: 15,
  },
});
