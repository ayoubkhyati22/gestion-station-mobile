import React, { useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface LoadingDotsProps {
  color?: string;
  size?: number;
  speed?: number;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ 
  color = '#2563EB', 
  size = 8,
  speed = 400 
}) => {
  const dot1Anim = new Animated.Value(0);
  const dot2Anim = new Animated.Value(0);
  const dot3Anim = new Animated.Value(0);

  useEffect(() => {
    const createAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: speed,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: speed,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = [
      createAnimation(dot1Anim, 0),
      createAnimation(dot2Anim, speed / 3),
      createAnimation(dot3Anim, (speed * 2) / 3),
    ];

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, [speed]);

  const getDotStyle = (animValue: Animated.Value) => ({
    opacity: animValue,
    transform: [
      {
        scale: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.2],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.dot, 
          { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }, 
          getDotStyle(dot1Anim)
        ]} 
      />
      <Animated.View 
        style={[
          styles.dot, 
          { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }, 
          getDotStyle(dot2Anim)
        ]} 
      />
      <Animated.View 
        style={[
          styles.dot, 
          { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }, 
          getDotStyle(dot3Anim)
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    // Dynamic styles applied via props
  },
});