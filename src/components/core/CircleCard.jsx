// Card.js
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Colors} from '../../_utils/GlobalStyle';
import {IMAGE_API_URL} from '../../_constant';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

const CircleCard = ({item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('BookDetails', {bookId: item?.id, bookItem: item})
      }
      style={styles.card}>
        <View style={styles.cardImage}>
          {item.cover_image && (
            <FastImage
              source={{uri: IMAGE_API_URL + item.cover_image}}
              style={styles.image}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}
        </View>
        <Text style={styles.title}>{item?.BookDetails?.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 10,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 50,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  title: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 10,
    textAlign: 'center',
    color: Colors.white,
  },
});

export default CircleCard;
