// HorizontalScrollView.js
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {CircleCard, Card} from '../../components'; // Import the Card component

const HorizontalScrollView = ({ data , isCircle =false}) => {
  const renderItem = ({ item }) => {
    return isCircle ? <CircleCard item={item} /> : <Card item={item} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item,) => item.id.toString()} // Ensure each item has a unique id
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
});

export default HorizontalScrollView;
