// Card.js
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Colors} from '../../_utils/GlobalStyle';
import LinearGradient from 'react-native-linear-gradient';

const Card = ({item}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardImage}>
        {item.image && (
          <Image source={{uri: item.image}} style={styles.image} />
        )}
      </View>
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.cardContent}>
      <View >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 10,
    width:180,
    height:250,
    borderRadius:20
  },
  cardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit:"cover",
    borderRadius:10
  },
  cardContent:{
    position:"absolute",
    bottom:0,
    left:0,
    right:0,
    top:0,
    margin:"auto",
    padding:8,
    borderRadius:10,
    width:"100%",
    height:"100%",
    justifyContent:"flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
    color: Colors.white,
  },
  description:{
    fontSize:14,
    color:Colors.gray
  }
});

export default Card
