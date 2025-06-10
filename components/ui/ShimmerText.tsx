import React, { useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface ShimmerTextProps {
  width?: number;
  height?: number;
  borderRadius?: number;
}

export const ShimmerText: React.FC<ShimmerTextProps> = ({ 
  width = 80, 
  height = 20, 
  borderRadius = 4 
}) => {
  const shimmerAnim = new Animated.Value(0);

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View 
      style={[
        styles.shimmerPlaceholder,
        { width, height, borderRadius, opacity }
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  shimmerPlaceholder: {
    backgroundColor: '#E5E7EB',
  },
});