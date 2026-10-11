import Feather from '@expo/vector-icons/Feather';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';

import { colors, font, radius, shadow, type } from '../theme/tokens';
import { useReducedMotion } from '../utils/hooks';

type FeatherName = keyof typeof Feather.glyphMap;

interface Task {
  title: string;
  price: string;
  distance: string;
  icon: FeatherName;
  /** Centre of the pill in the 440×440 design space. */
  x: number;
  y: number;
}

const DESIGN = 440;
const PILL_W = 176;
const PILL_H = 50;
const RINGS = [70, 130, 190];

const tasks: Task[] = [
  { title: 'Fix the Wi‑Fi', price: '$50', distance: '600 m', icon: 'wifi', x: 108, y: 118 },
  { title: 'Mow the lawn', price: '$35', distance: '1.2 km', icon: 'scissors', x: 326, y: 92 },
  { title: 'Walk Biscuit', price: '$20/hr', distance: '350 m', icon: 'heart', x: 338, y: 244 },
  { title: 'Move a sofa', price: '$60', distance: '900 m', icon: 'truck', x: 104, y: 300 },
  { title: 'Assemble a desk', price: '$45', distance: '1.5 km', icon: 'tool', x: 300, y: 362 },
];

/** Other mates around — quiet texture so the neighbourhood doesn't feel empty. */
const mates = [
  { x: 286, y: 168 },
  { x: 156, y: 226 },
  { x: 244, y: 306 },
  { x: 178, y: 372 },
  { x: 388, y: 330 },
];

const useNative = Platform.OS !== 'web';

interface Props {
  /** Rendered size in px; the board is designed at 440 and scaled. */
  size: number;
}

/**
 * The most Lancemates thing there is: you in the middle, tasks a short
 * walk away. This is the one place the page spends its motion budget —
 * pills pop in once, then "you" keeps a slow pulse.
 */
export default function NeighborhoodBoard({ size }: Props) {
  const reduced = useReducedMotion();
  const scale = size / DESIGN;
  const board = useRef(new Animated.Value(0)).current;
  const pills = useRef(tasks.map(() => new Animated.Value(0))).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) {
      board.setValue(1);
      pills.forEach((v) => v.setValue(1));
      return;
    }
    const entrance = Animated.sequence([
      Animated.timing(board, { toValue: 1, duration: 420, useNativeDriver: useNative }),
      Animated.stagger(
        110,
        pills.map((v) =>
          Animated.spring(v, { toValue: 1, useNativeDriver: useNative, speed: 14, bounciness: 9 })
        )
      ),
    ]);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: useNative,
        }),
        Animated.delay(600),
      ])
    );
    entrance.start(({ finished }) => finished && loop.start());
    return () => {
      entrance.stop();
      loop.stop();
    };
  }, [reduced, board, pills, pulse]);

  return (
    <View style={{ width: size, height: size }}>
      <Animated.View
        style={[
          styles.board,
          { opacity: board, transform: [{ scale }], transformOrigin: 'top left' },
        ]}
      >
        {RINGS.map((r) => (
          <View
            key={r}
            style={[
              styles.ring,
              { width: r * 2, height: r * 2, borderRadius: r, left: DESIGN / 2 - r, top: DESIGN / 2 - r },
            ]}
          />
        ))}

        {mates.map((m, i) => (
          <View key={i} style={[styles.mate, { left: m.x - 4, top: m.y - 4 }]} />
        ))}

        {/* You */}
        {!reduced && (
          <Animated.View
            style={[
              styles.pulse,
              {
                opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] }),
                transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 3.4] }) }],
              },
            ]}
          />
        )}
        <View style={styles.you} />
        <Text style={styles.youLabel}>You</Text>

        {/* Header chip */}
        <View style={styles.status}>
          <View style={styles.liveDot} />
          <Text style={styles.statusText}>5 open tasks within 2 km</Text>
        </View>

        {tasks.map((task, i) => (
          <Animated.View
            key={task.title}
            style={[
              styles.pill,
              {
                left: task.x - PILL_W / 2,
                top: task.y - PILL_H / 2,
                opacity: pills[i],
                transform: [{ scale: pills[i].interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
              },
            ]}
          >
            <View style={styles.pillIcon}>
              <Feather name={task.icon} size={13} color={colors.clover} />
            </View>
            <View style={styles.pillText}>
              <Text style={styles.pillTitle} numberOfLines={1}>
                {task.title}
              </Text>
              <View style={styles.pillMeta}>
                <Text style={styles.pillPrice}>{task.price}</Text>
                <Text style={styles.pillDistance}>{task.distance}</Text>
              </View>
            </View>
          </Animated.View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: DESIGN,
    height: DESIGN,
    borderRadius: radius.hero,
    backgroundColor: '#F0F7F2',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: colors.mintLine,
  },
  mate: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.mintLine,
  },
  pulse: {
    position: 'absolute',
    left: DESIGN / 2 - 14,
    top: DESIGN / 2 - 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.marigold,
  },
  you: {
    position: 'absolute',
    left: DESIGN / 2 - 9,
    top: DESIGN / 2 - 9,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.marigold,
    borderWidth: 3,
    borderColor: colors.paper,
    ...shadow.soft,
  },
  youLabel: {
    position: 'absolute',
    left: DESIGN / 2 - 20,
    top: DESIGN / 2 + 13,
    width: 40,
    textAlign: 'center',
    ...type.tiny,
    fontFamily: font.bold,
    color: colors.ink,
  },
  status: {
    position: 'absolute',
    left: 18,
    top: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    ...shadow.soft,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.clover },
  statusText: { ...type.tiny, fontFamily: font.medium, color: colors.inkSoft },
  pill: {
    position: 'absolute',
    width: PILL_W,
    height: PILL_H,
    borderRadius: radius.chip,
    backgroundColor: colors.paper,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingLeft: 7,
    paddingRight: 12,
    ...shadow.soft,
  },
  pillIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: { flex: 1, gap: 1 },
  pillTitle: { fontFamily: font.semibold, fontSize: 13, lineHeight: 16, color: colors.ink },
  pillMeta: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  pillPrice: { fontFamily: font.bold, fontSize: 12, lineHeight: 15, color: colors.clover },
  pillDistance: { fontFamily: font.regular, fontSize: 11.5, lineHeight: 15, color: colors.inkSoft },
});
