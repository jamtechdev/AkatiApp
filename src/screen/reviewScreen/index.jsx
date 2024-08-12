import {
  View,
  Text,
  StyleSheet,
  Animated,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  CustomStarRating,
  CustomText,
  HeadingText,
  RowContainer,
  Skeleton,
} from '../../components';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalStyles, {Colors} from '../../_utils/GlobalStyle';
import {commonServices} from '../../_services/common.service';
import {useAppContext} from '../../_customContext/AppProvider';

export default function ReviewScreen() {
  const [reviews, setReviews] = useState('');
  const [starCount, setStarCount] = useState(0);
  const [ratingDetails, setRatingDetails] = useState();
  const {showToast, showLoader, hideLoader} = useAppContext();

  useEffect(() => {
    getAppReviews();
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
        setRatingDetails(rateData);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const processReviewData = data => {
    const filteredData = data.map(review => ({
      id: review.id,
      description: review.description,
      star: parseInt(review.star),
      user_id: review.user_id,
    }));

    const totalStars = filteredData.reduce(
      (total, review) => total + review.star,
      0,
    );
    const avgReviewPoint = totalStars / filteredData.length;

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

  const handleChange = text => {
    setReviews(text);
  };

  const handlePostReview = () => {
    if (starCount === 0 || reviews.trim() === '') {
      showToast('Please provide both a rating and a review!', 'info');
      return;
    }

    const reviewData = {
      star: starCount,
      description: reviews,
    };

    console.log('Submitting review:', reviewData);

    commonServices
      .postAppReview(reviewData)
      .then(res => {
        console.log('Review submitted successfully:', res.data);
        getAppReviews();
        setStarCount(0);
        setReviews('');
        showToast('Thanks for submitting your app review.', 'success');
      })
      .catch(error => {
        showToast('Something went wrong!', 'error');
        console.log('Error submitting review:', error);
      });
  };

  const renderReviewItem = ({item, index}) => (
    <View style={styles.reviewItem} key={index}>
      <CustomText style={styles.reviewText}>{index + 1} Star</CustomText>
      <View style={styles.containerAni}>
        <Animated.View
          style={[
            styles.bar,
            {width: (item / ratingDetails.reviewLength) * 200},
          ]}
        />
      </View>
      <CustomText style={styles.reviewText}>{item}</CustomText>
    </View>
  );

  return (
    <RowContainer style={styles.container}>
      <HeadingText>App Reviews & Ratings</HeadingText>
      {ratingDetails ? (
        <>
          <FlatList
            data={ratingDetails.reviewCountArray}
            renderItem={renderReviewItem}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={
              <View style={styles.headerContainer}>
                <CustomText style={styles.totalRate}>
                  {ratingDetails?.avgReviewPoint.toFixed(1) ?? '4.7'}
                </CustomText>
                <View style={styles.ratingContainer}>
                  <CustomStarRating
                    size={18}
                    rate={ratingDetails?.avgReviewPoint.toFixed(1)}
                  />
                  <CustomText style={styles.rateText}>
                    Based on {ratingDetails?.reviewLength} ratings
                  </CustomText>
                </View>
              </View>
            }
            ListFooterComponent={
              <View style={styles.footerContainer}>
                <HeadingText>Add Review</HeadingText>
                <View style={styles.reviewInputContainer}>
                  <View style={styles.starView}>
                    <CustomStarRating
                      size={30}
                      onRatingChange={handleRatingChange}
                      rate={starCount}
                      isDisable={false}
                    />
                  </View>
                  <TextInput
                    multiline
                    style={styles.inputView}
                    placeholder="Enter your review here..."
                    onChangeText={handleChange}
                    value={reviews}
                    placeholderTextColor={Colors.white}
                    selectionColor={Colors.secondary}
                    underlineColorAndroid="transparent"
                    autoCapitalize="sentences"
                    autoCorrect={false}
                  />
                </View>
                <Button title={'Submit'} onPress={handlePostReview} />
              </View>
            }
          />
        </>
      ) : (
        <Skeleton isLoading={true} isLine />
      )}
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 5,
  },
  totalRate: {
    color: Colors.gradientReverse,
    fontSize: 50,
    fontWeight: '600',
  },
  ratingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateText: {
    color: Colors.darkGray,
    fontSize: 14,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 3,
    marginVertical: 2,
  },
  reviewText: {
    fontSize: 14,
  },
  starView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
    marginTop: 20,
  },
  containerAni: {
    height: 10,
    width: 200,
    backgroundColor: Colors.tertiary,
    borderRadius: 5,
  },
  bar: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 5,
  },
  reviewInputContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 15,
  },
  footerContainer: {
    paddingTop: 20,
  },
  inputView: {
    color: Colors.white,
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: Colors.secondary,
    padding: 18,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: Colors.tertiary,
    fontSize: 16,
    lineHeight: 20,
  },
});
