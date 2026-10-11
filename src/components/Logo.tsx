import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, font } from '../theme/tokens';

interface Props {
  /** Diameter of the mark in px. The wordmark scales with it. */
  size?: number;
  /** Set to render the mark only. */
  hideWordmark?: boolean;
  /** Light variant for dark surfaces. */
  onDark?: boolean;
  onPress?: () => void;
}

/**
 * The mark is the brand system in miniature: a ring (the radius you're
 * willing to travel) with a dot sitting on it (someone nearby).
 */
export default function Logo({ size = 26, hideWordmark, onDark, onPress }: Props) {
  const stroke = Math.round(size * 0.2);
  const dot = Math.round(size * 0.42);
  const r = size / 2 - stroke / 2;
  // Dot sits on the ring at 2 o'clock.
  const angle = -Math.PI / 4;
  const dotLeft = size / 2 + r * Math.cos(angle) - dot / 2;
  const dotTop = size / 2 + r * Math.sin(angle) - dot / 2;

  const content = (
    <View style={styles.row} accessibilityRole={onPress ? 'link' : undefined} accessibilityLabel="Lancemates">
      <View style={{ width: size, height: size }}>
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderColor: onDark ? colors.paper : colors.clover,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: dotLeft,
            top: dotTop,
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            backgroundColor: colors.marigold,
            borderWidth: Math.max(2, Math.round(size * 0.08)),
            borderColor: onDark ? colors.ink : colors.paper,
          }}
        />
      </View>
      {!hideWordmark && (
        <Text
          style={[
            styles.wordmark,
            { fontSize: size * 0.8, color: onDark ? colors.paper : colors.ink },
          ]}
        >
          Lancemates
        </Text>
      )}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} hitSlop={8} style={({ pressed }) => pressed && styles.pressed}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  wordmark: { fontFamily: font.bold, letterSpacing: -0.5 },
  pressed: { opacity: 0.7 },
});
