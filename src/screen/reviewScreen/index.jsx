import {
  View,
  Text,
  StyleSheet,
  ProgressBarAndroidComponent,
  Animated,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Button, CustomText, HeadingText, RowContainer} from '../../components';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../_utils/GlobalStyle';
export default function ReviewScreen() {
  const stars = Array(5).fill('star-outline');
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, []);
  return (
    <RowContainer style={styles.container}>
      <ScrollView>
        <HeadingText>Reviews & Ratings</HeadingText>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 15,
          }}>
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
        {stars.map((star, index) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 15,
            }}
            key={index}>
            <CustomText>1 Star</CustomText>
            <View style={styles.containerAni}>
              <Animated.View style={[styles.bar, {width: width}]} />
            </View>
            <CustomText>1</CustomText>
          </View>
        ))}
        <HeadingText>Add Review</HeadingText>
        <View>
          <View style={[styles.starView, {margin: 5}]}>
            {stars.map((star, index) => (
              <Icon key={index} name={star} size={25} />
            ))}
          </View>
          <TextInput
            multiline
            style={styles.reviewText}
            placeholder="Enter your review here..."></TextInput>
        </View>
        <Button title={'Submit'} style={{width: '40%'}} />
      </ScrollView>
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  totalRate: {
    color: Colors.gradientReverse,
    fontSize: 60,
  },
  rateText: {
    color: Colors.darkGray,
  },
  starView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
  },
  containerAni: {
    height: 10,
    width: 200,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  bar: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 5,
  },
  reviewText: {
    backgroundColor: Colors.tertiary,
    borderRadius: 8,
    width: '80%',
    height: 100,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
});
