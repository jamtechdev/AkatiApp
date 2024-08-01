import {View, Text, ScrollView} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  CustomText,
  HeadingText,
  RowContainer,
  SkeletonLoader,
} from '../../components';
import HorizontalScrollView from '../../components/core/HorizontalScrollView';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a network request
    setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds
  }, []);

  return (
    <RowContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <HeadingText>From Your Library </HeadingText>
          <HorizontalScrollView data={data} isCircle={true} />
        </View>
        <SkeletonLoader isLoading={loading}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
         
            <View style={{marginLeft: 16}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>John Doe</Text>
              <Text>Example text here</Text>
            </View>
          </View>
        </SkeletonLoader>
        <View>
          <HeadingText>New In Akati </HeadingText>
          <HorizontalScrollView data={data} />
        </View>
        <View>
          <HeadingText>Must Read </HeadingText>
          <HorizontalScrollView data={data} />
        </View>
      </ScrollView>
    </RowContainer>
  );
}
