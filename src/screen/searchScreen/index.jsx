import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import {
  CustomText,
  HeadingText,
  RowContainer,
  TextBadge,
} from '../../components';
import { TextInput } from 'react-native-gesture-handler';
import { Colors } from '../../_utils/GlobalStyle';
import Icon from 'react-native-vector-icons/Ionicons';

const categories = ['Happy', 'Sad', 'Exciting', 'Mystery', 'Fantasy', 'Sci-Fi', 'Romance', 'Thriller'];

export default function SearchScreen() {
  return (
    <RowContainer>
      <View>
        <TextInput
          placeholder="Which book would you like to read today..."
          style={styles.searchBar}
          placeholderTextColor={Colors.darkGray}
        />
        <View style={styles.searchIcon}>
          <Icon size={25} color={Colors.white} name={'search'} />
        </View>
      </View>
      <ScrollView>
      <View>
        <HeadingText>Select Book Categories</HeadingText>
        <View style={styles.categoryContainer}>
          {categories.map((category, index) => (
            <TextBadge key={index} text={category} />
          ))}
        </View>
      </View>
      <View>
        <HeadingText>Hot search</HeadingText>
        <View style={styles.categoryContainer}>
          {categories.map((category, index) => (
            <TextBadge key={index} text={category} />
          ))}
        </View>
      </View>
      <View>
        <HeadingText>Recent search</HeadingText>
        <View style={{marginVertical:10}}>
          {categories.map((category, index) => (
            <View style={styles.RecentContainer} key={index}>
                <Text style={{color:Colors.white,fontWeight:"bold",fontSize:12}}>{category}</Text>
                <Icon size={25} color={Colors.white} name={'close-circle-outline'} />
            </View>
          ))}
        </View>
      </View>
      </ScrollView>
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    padding: 15,
    borderRadius: 50,
    color: Colors.white,
    paddingRight: 50,
    marginBottom: 10,
  },
  searchIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    position: 'absolute',
    right: 5,
    top: 4,
    bottom: 0,
    margin: 'auto',
  },
  categoryContainer: {
    flexWrap: 'wrap',
    gap: 5,
    flexDirection: 'row',
    marginVertical: 10,
  },
  RecentContainer:{
    width:"100%",
    justifyContent:"space-between",
    alignItems:"center",
    flexDirection:"row",
    padding:8,
    marginVertical:5,
    borderWidth:1,
    borderColor:Colors.darkGray,
    borderRadius:5

  }
});
