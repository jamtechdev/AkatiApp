import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomStarRating = ({
  rate = 0,
  onRatingChange,
  style,
  isDisable = false,
}) => {
  const [rating, setRating] = useState(rate);

  const handleStarPress = index => {
    if (isDisable) {
      return;
    }
    setRating(index + 1);
    if (onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {[...Array(5)].map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleStarPress(index)}
          activeOpacity={0.7}>
          <Icon
            name={index < rating ? 'star' : 'star-outline'}
            size={30}
            color={index < rating ? 'gold' : 'gray'}
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  star: {
    marginHorizontal: 5,
  },
});

export default CustomStarRating;
