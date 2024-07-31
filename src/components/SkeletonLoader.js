import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const SkeletonLoader = ({ isLoading, children }) => {
  const translateX = useSharedValue(-width);

  React.useEffect(() => {
    if (isLoading) {
      translateX.value = withRepeat(
        withSpring(width * 2, { damping: 2, stiffness: 60 }),
        -1,
        false
      );
    }
  }, [isLoading]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#e0e0e0', '#f0f0f0', '#e0e0e0']}
          style={styles.gradient}
        >
          <Animated.View style={[styles.skeleton, animatedStyle]} />
        </LinearGradient>
        <LinearGradient
          colors={['#e0e0e0', '#f0f0f0', '#e0e0e0']}
          style={styles.gradient}
        >
          <Animated.View style={[styles.skeleton, animatedStyle]} />
        </LinearGradient>
        <LinearGradient
          colors={['#e0e0e0', '#f0f0f0', '#e0e0e0']}
          style={styles.gradient}
        >
          <Animated.View style={[styles.skeleton, animatedStyle]} />
        </LinearGradient>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    width: '80%',
    height: 20,
    marginBottom: 10,
    borderRadius: 4,
    overflow: 'hidden',
  },
  skeleton: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
});

export default SkeletonLoader;
