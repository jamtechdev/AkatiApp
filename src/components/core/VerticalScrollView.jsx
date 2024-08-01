import React from 'react'
import {View, FlatList, StyleSheet} from 'react-native'
import {Card, CircleCard} from '../../components' // Import the Card and CircleCard components

const VerticalScrollView = ({data}) => {
  const renderItem = ({item}) => {
    return (
      <View style={styles.cardContainer}>
       <Card item={item} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    flex: 1,
    margin: 8,
  },
})

export default VerticalScrollView;
