// Card.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../_utils/GlobalStyle';
import {IMAGE_API_URL} from '../../_constant';

const Card = ({item, style}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardImage}>
        {item.cover_image && (
          <FastImage
            source={{uri: IMAGE_API_URL + item.cover_image}}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
        )}
      </View>
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.cardContent}>
        <View>
          <Text style={styles.title}>{item?.BookDetails?.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item?.BookDetails?.description}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 10,
    width: '100%',
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    borderRadius: 10,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
    color: Colors.white,
  },
  description: {
    fontSize: 14,
    color: Colors.gray,
    // Ensure text is truncated properly
    overflow: 'hidden',
  },
});

export default Card;
