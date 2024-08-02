import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../_utils/GlobalStyle';

const { width } = Dimensions.get('window');

const SkeletonLoader = ({ isLoading }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false, // Set to false for properties not supported by native driver
        })
      ).start();
    } else {
      animatedValue.stopAnimation();
    }
  }, [isLoading, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width]
  });

  if (!isLoading) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageContainer} />
        <View style={styles.textContainer}>
          <View style={styles.title} />
          <View style={styles.line} />
          <View style={styles.line} />
        </View>
        <Animated.View style={[styles.animatedGradient, { transform: [{ translateX }] }]}>
          <LinearGradient
            colors={['rgba(224, 224, 224, 0)', 'rgba(240, 240, 240, 0.5)', 'rgba(224, 224, 224, 0)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.tertiary,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 16,
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    width: '60%',
    height: 20,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    marginBottom: 8,
  },
  line: {
    width: '80%',
    height: 20,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    marginBottom: 8,
  },
  animatedGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default SkeletonLoader;
