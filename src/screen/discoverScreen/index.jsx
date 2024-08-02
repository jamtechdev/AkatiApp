import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  CustomText,
  HeadingText,
  RowContainer,
  SkeletonLoader,
  CustomStarRating,
  HorizontalScrollView,
  Skeleton,
} from '../../components';

export default function DiscoverScreen() {
  const data = [
    {
      id: 1,
      title: 'Card 1',
      description: 'This is card 1',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: 'Card 2',
      description: 'This is card 2',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      title: 'Card 3',
      description: 'This is card 3',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 4,
      title: 'Card 4',
      description: 'This is card 4',
      image: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <RowContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <HeadingText>From Your Library </HeadingText>
          {/* <Skeleton isLoading={true}  count={3} numColumns={3} isCircleCard/> */}
          <HorizontalScrollView data={data} isCircle={true} />
        </View>
        <View>
          <HeadingText>New In Akati </HeadingText>
          {/* <Skeleton isLoading={true}  count={2} numColumns={2}/> */}
          <HorizontalScrollView data={data} />
        </View>
        <View>
          <HeadingText>Must Read </HeadingText>
          {/* <Skeleton isLoading={true}  count={2} numColumns={2}/> */}
          <HorizontalScrollView data={data} />
        </View>
      </ScrollView>
    </RowContainer>
  );
}
