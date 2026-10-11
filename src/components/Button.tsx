import { ReactNode, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { colors, font, radius } from '../theme/tokens';

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark';
type Size = 'md' | 'lg';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  /** Optional leading element, e.g. an icon. */
  leading?: ReactNode;
  style?: ViewStyle;
}

const useNative = Platform.OS !== 'web';

/**
 * The only shape a button comes in is a pill. Feedback is a small press
 * scale (it answers the tap) and a colour shift on hover for pointer devices.
 */
export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth,
  loading,
  loadingLabel,
  disabled,
  leading,
  style,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const [hovered, setHovered] = useState(false);
  const inactive = disabled || loading;

  const animateTo = (value: number) =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: useNative,
      speed: 40,
      bounciness: 4,
    }).start();

  const palette = palettes[variant];
  const backgroundColor = hovered && !inactive ? palette.hoverBg : palette.bg;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, fullWidth && styles.fullWidth, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: inactive, busy: loading }}
        accessibilityLabel={loading && loadingLabel ? loadingLabel : label}
        disabled={inactive}
        onPress={onPress}
        onPressIn={() => animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        style={[
          styles.base,
          sizes[size],
          { backgroundColor, borderColor: palette.border },
          inactive && styles.inactive,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={palette.text} />
        ) : (
          leading
        )}
        <Text style={[styles.label, size === 'lg' && styles.labelLg, { color: palette.text }]}>
          {loading && loadingLabel ? loadingLabel : label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const palettes: Record<Variant, { bg: string; hoverBg: string; text: string; border: string }> = {
  primary: { bg: colors.clover, hoverBg: colors.cloverDeep, text: colors.paper, border: colors.clover },
  secondary: { bg: colors.paper, hoverBg: colors.mint, text: colors.ink, border: colors.mintLine },
  ghost: { bg: 'transparent', hoverBg: colors.mint, text: colors.ink, border: 'transparent' },
  onDark: { bg: colors.paper, hoverBg: colors.mint, text: colors.clover, border: colors.paper },
};

const sizes: Record<Size, ViewStyle> = {
  md: { height: 46, paddingHorizontal: 22 },
  lg: { height: 56, paddingHorizontal: 30 },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  fullWidth: { alignSelf: 'stretch' },
  inactive: { opacity: 0.6 },
  label: { fontFamily: font.semibold, fontSize: 15, letterSpacing: -0.1 },
  labelLg: { fontSize: 16.5 },
});
