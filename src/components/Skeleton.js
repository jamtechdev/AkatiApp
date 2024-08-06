import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {SkeletonLoader} from '../components';

const Skeleton = ({
  isLoading,
  count = 4,
  numColumns = 1,
  isHorizontal = false,
  isCircleCard,
  isCard,
  isList,
  isLine,
  isBatch
}) => {
  const getStyle = () => {
    if (isCircleCard) {
      return styles.isCircleCard;
    } else if (isCard) {
      return styles.isCard;
    } else if (isList) {
      return styles.isList;
    } else if (isLine) {
      return styles.isLine;
    } else if(isBatch){
      return styles.isBatch
    }
    return {};
  };

  return (
    <View>
      {isHorizontal ? (
        <FlatList
          data={Array(count)}
          renderItem={() => (
            <SkeletonLoader isLoading={isLoading} layoutStyle={getStyle()} />
          )}
          keyExtractor={(item, index) => index}
          horizontal={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={Array(count)}
          renderItem={() => (
            <SkeletonLoader isLoading={isLoading} layoutStyle={getStyle()} />
          )}
          numColumns={numColumns}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
  },
  isCircleCard: {
    width: 100,
    height: 100,
    // borderWidth: 1,
    // borderColor: Colors.secondary,
    borderRadius: 50,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  isCard: {
    height: 180,
    // borderColor: Colors.secondary,
    // borderWidth: 1,
  },
  isList: {
    height: 55,
  },
  isLine: {
    height: 10,
    padding: 0,
  },
  isBatch:{
    width: 100,
    height: 30,
    borderRadius:5,
  }
});

export default Skeleton;
