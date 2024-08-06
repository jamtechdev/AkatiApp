import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomStarRating = ({
  rate = 0,
  onRatingChange,
  style,
  isDisable = true,
  size = 20,
}) => {
  const [rating, setRating] = useState(rate);

  useEffect(() => {
    setRating(rate);
  }, [rate]);

  const handleStarPress = index => {
    if (isDisable) {
      return;
    }
    const newRating = index + 1;
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const renderStar = (index) => {
    const fullStar = Math.floor(rating);
    const halfStar = rating - fullStar >= 0.5;
    if (index < fullStar) {
      return 'star';
    } else if (index === fullStar && halfStar) {
      return 'star-half-full';
    } else {
      return 'star-outline';
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
            name={renderStar(index)}
            size={size}
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
