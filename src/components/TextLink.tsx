import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextStyle } from 'react-native';

import { colors, font, type } from '../theme/tokens';

interface Props {
  label: string;
  onPress: () => void;
  /** 'strong' is the green in-form link, 'quiet' is the footer/nav link. */
  tone?: 'strong' | 'quiet';
  style?: TextStyle;
}

export default function TextLink({ label, onPress, tone = 'strong', style }: Props) {
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      hitSlop={6}
    >
      {({ pressed }) => (
        <Text
          style={[
            styles.base,
            tone === 'strong' ? styles.strong : styles.quiet,
            (hovered || pressed) && styles.active,
            style,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { ...type.small, fontFamily: font.semibold },
  strong: { color: colors.clover },
  quiet: { color: colors.inkSoft, fontFamily: font.medium },
  active: { textDecorationLine: 'underline' },
});
