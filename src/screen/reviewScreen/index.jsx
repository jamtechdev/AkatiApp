import {
  View,
  Text,
  StyleSheet,
  ProgressBarAndroidComponent,
  Animated,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  CustomStarRating,
  CustomText,
  HeadingText,
  RowContainer,
} from '../../components';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../_utils/GlobalStyle';
import {useToast} from '../../_customHook';
import {commonServices} from '../../_services/common.service';
export default function ReviewScreen() {
  const stars = Array(5).fill('star-outline');
  const width = useRef(new Animated.Value(0)).current;
  const [reviews, setReviews] = useState('');
  const [starCount, setStarCount] = useState(0);
  const [ratingDetails, setRatingDetails] = useState();
  const [showToast, ToastComponent] = useToast();
  useEffect(() => {
    getAppReviews();
    Animated.timing(width, {
      toValue: 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, []);
  const handleRatingChange = newRating => {
    setStarCount(newRating);
    console.log('New Rating:', newRating);
  };

  const getAppReviews = () => {
    commonServices
      .getAppReview()
      .then(res => {
        const rateData = processReviewData(res.data);

        // setReviewDetails(res.data);
        // const ratingValue = processReviewData(res.data);
        setRatingDetails(rateData);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const processReviewData = data => {
    // Filter out the required fields
    const filteredData = data.map(review => ({
      id: review.id,
      description: review.description,
      star: parseInt(review.star),
      user_id: review.user_id,
    }));

    // Calculate total average review point
    const totalStars = filteredData.reduce(
      (total, review) => total + review.star,
      0,
    );
    const avgReviewPoint = totalStars / filteredData.length;

    // Calculate count of all the review points (1-5)
    const reviewCounts = filteredData.reduce((counts, review) => {
      counts[review.star] = (counts[review.star] || 0) + 1;
      return counts;
    }, {});

    const reviewCountArray = Array.from(
      {length: 5},
      (_, i) => reviewCounts[i + 1] || 0,
    );
    const reviewLength = data.length;
    return {
      filteredData,
      avgReviewPoint,
      reviewCountArray,
      reviewLength,
    };
  };

  const handlePostReview = () => {
    if (starCount === 0 || reviews.trim() === '') {
      showToast('Please provide both a rating and a review star!', 'info');
      return;
    }

    const reviewData = {
      star: starCount,
      description: reviews,
    };
    commonServices
      .postAppReview(reviewData)
      .then(res => {
        getAppReviews();
        setStarCount(0);
        setReviews('');
        showToast('Thanks for submitting app review.', 'success');
      })
      .catch(error => {
        showToast('SomeThing went wrong!', 'error');
        console.log(error);
      });
  };
  return (
    <RowContainer style={styles.container}>
      <ScrollView>
        <HeadingText>Reviews & Ratings</HeadingText>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 15,
          }}>
          <CustomText style={styles.totalRate}>
            {ratingDetails?.avgReviewPoint.toFixed(1) ?? '4.7'}
          </CustomText>
          <View>
            <CustomStarRating
              isDisable={true}
              rate={parseInt(ratingDetails?.avgReviewPoint)}
            />

            <CustomText style={styles.rateText}>Based on 14 ratings</CustomText>
          </View>
        </View>
        {ratingDetails &&
          ratingDetails.reviewCountArray &&
          ratingDetails.reviewCountArray.map((item, index) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 15,
                }}
                key={index}>
                <CustomText>{index + 1} Star</CustomText>
                <View style={styles.containerAni}>
                  <Animated.View
                    style={[
                      styles.bar,
                      {width: (item / ratingDetails.reviewLength) * 200},
                    ]}
                  />
                </View>
                <CustomText>{item}</CustomText>
              </View>
            );
          })}

        <HeadingText>Add Review</HeadingText>
        <View>
          <View style={[styles.starView, {margin: 5}]}>
            <CustomStarRating
              onRatingChange={handleRatingChange}
              rate={starCount}
            />
          </View>
          <TextInput
            multiline
            style={styles.reviewText}
            placeholder="Enter your review here..."
            onChangeText={e => setReviews(e)}
            value={reviews}
          />
        </View>
        <Button
          title={'Submit'}
          style={{width: '40%'}}
          onPress={handlePostReview}
        />
        {ToastComponent}
      </ScrollView>
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  totalRate: {
    color: Colors.gradientReverse,
    fontSize: 60,
  },
  rateText: {
    color: Colors.darkGray,
  },
  starView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
  },
  containerAni: {
    height: 10,
    width: 200,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  bar: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 5,
  },
  reviewText: {
    backgroundColor: Colors.tertiary,
    borderRadius: 8,
    width: '80%',
    height: 100,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
});
