import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomStarRating = ({ totalStars = 5, onRatingChange, style }) => {
    const [rating, setRating] = useState(0);

    const handleStarPress = (index) => {
        setRating(index + 1);
        if (onRatingChange) {
            onRatingChange(index + 1);
        }
    };

    return (
        <View style={[styles.container, style]}>
            {[...Array(totalStars)].map((_, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handleStarPress(index)}
                    activeOpacity={0.7}
                >
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
