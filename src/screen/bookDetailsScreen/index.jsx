import React from 'react';
import {
  Button,
  CustomStarRating,
  RowContainer,
  TabSwitcher,
} from '../../components';
import {Image, ScrollView, Text, View, StyleSheet} from 'react-native';
import {Colors} from '../../_utils/GlobalStyle';

function BookDetailsScreen() {
  const tabs = [
    {
      key: 'Reviews',
      title: 'Reviews',
      content: (
        <View style={styles.tabContent}>
          <View style={styles.reviewHeader}>
            <Image
              style={styles.reviewImage}
              source={{
                uri: 'https://feupsontec.com/storage/book-front-cover/63ad35ebb2492.jpeg',
              }}
              resizeMode="stretch"
            />
            <View style={styles.reviewHeaderTextContainer}>
              <Text style={styles.reviewAuthor}>George R.R. Martin</Text>
              <View style={styles.reviewRating}>
                <CustomStarRating rate={4} />
              </View>
            </View>
          </View>
          <View style={styles.reviewDivider}>
            <Text style={styles.reviewDescription}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </Text>
          </View>
        </View>
      ),
    },
    {
      key: 'Chapters',
      title: 'Chapters',
      content: (
        <View style={styles.tabContent}>
          {/* Chapters content */}
          <Text style={styles.description}>Chapters content goes here...</Text>
        </View>
      ),
    },
  ];

  return (
    <RowContainer style={{paddingHorizontal: 0, paddingTop: 0, flex: 1}}>
      <View style={{flex: 1}}>
        <View style={{position: 'relative'}}>
          <Image
            source={{
              uri: 'https://feupsontec.com/storage/book-front-cover/63ad35ebb2492.jpeg',
            }}
            style={{width: '100%', height: 200}}
            resizeMode="cover"
          />
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)', // This simulates the blur effect
              opacity: 0.8,
            }}></View>
        </View>
        <View style={styles.centeredImage}>
          <Image
            style={styles.mainImage}
            source={{
              uri: 'https://feupsontec.com/storage/book-front-cover/63ad35ebb2492.jpeg',
            }}
            resizeMode="stretch"
          />
        </View>
        <ScrollView style={{flex: 1}}>
          <View style={{paddingVertical: 20, gap: 10, paddingHorizontal: 10}}>
            <Text
              style={{color: Colors.white, fontWeight: '600', fontSize: 22}}>
              A long way gone
            </Text>
            <Text
              style={{color: Colors.darkGray, fontWeight: '400', fontSize: 12}}>
              Author: George R.R. Martin
            </Text>
            <View>
              <CustomStarRating rate={4} />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <View style={{width: '50%', paddingHorizontal: 5}}>
                <Button
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    backgroundColor: Colors.white,
                  }}
                  textStyle={{color: Colors.secondary, fontWeight: '400'}}
                  gradient={false}
                  title={'Start Reading'}
                />
              </View>
              <View style={{width: '50%', paddingHorizontal: 5}}>
                <Button
                  style={{paddingVertical: 10, paddingHorizontal: 10}}
                  title={'Remove Library'}
                />
              </View>
            </View>
            <View
              style={{
                borderTopWidth: 1,
                borderColor: Colors.darkGray,
                paddingTop: 15,
                marginTop: 10,
              }}>
              <Text
                style={{
                  color: Colors.gray,
                  fontWeight: '400',
                  fontSize: 14,
                  lineHeight: 22,
                }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </Text>
            </View>
          </View>
          <TabSwitcher tabs={tabs} />
        </ScrollView>
      </View>
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  centeredImage: {
    alignItems: 'center',
    marginTop: -140,
  },
  mainImage: {
    width: 200,
    height: 250,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  tabContent: {
    padding: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reviewImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  reviewHeaderTextContainer: {
    gap: 5,
  },
  reviewAuthor: {
    color: Colors.gray,
    fontWeight: '600',
    fontSize: 14,
  },
  reviewRating: {
    marginLeft: -5,
  },
  reviewDivider: {
    borderTopWidth: 1,
    borderColor: Colors.darkGray,
    paddingTop: 15,
    marginTop: 10,
  },
  reviewDescription: {
    color: Colors.gray,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
  },
});

export default BookDetailsScreen;
