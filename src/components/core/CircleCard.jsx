// Card.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../../_utils/GlobalStyle';

const CircleCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardImage}>{item.image && <Image source={{ uri: item.image }} style={styles.image} />}</View>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight:10
  },
  cardImage:{
    width: 100,
    height: 100,
    borderWidth:1,
    borderColor:Colors.secondary,
    borderRadius:50,
    padding:5,
    justifyContent:"center",
    alignItems:"center"
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  title: {
    fontSize: 14,
    fontWeight: '400',
    marginTop:10,
    textAlign:"center",
    color:Colors.darkGray
  },
});

export default CircleCard;
