import Feather from '@expo/vector-icons/Feather';
import { useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, font, radius, shadow, type, webOnly } from '../theme/tokens';
import { useBreakpoint } from '../utils/hooks';

type Category = 'Yard' | 'Moving' | 'Tech help' | 'Pets' | 'Assembly' | 'Cleaning';

interface Task {
  id: string;
  title: string;
  price: string;
  distance: string;
  posted: string;
  category: Category;
  icon: 'scissors' | 'truck' | 'wifi' | 'heart' | 'tool' | 'droplet';
  poster: string;
  rating: string;
  fresh?: boolean;
}

/** Illustrative board — no backend, these stand in for a real feed. */
const tasks: Task[] = [
  {
    id: 'lawn',
    title: 'Mow the lawn before the weekend',
    price: '$35',
    distance: '1.2 km',
    posted: '12 min ago',
    category: 'Yard',
    icon: 'scissors',
    poster: 'Priya R.',
    rating: '4.9',
    fresh: true,
  },
  {
    id: 'sofa',
    title: 'Help move a sofa up one flight',
    price: '$60',
    distance: '900 m',
    posted: '40 min ago',
    category: 'Moving',
    icon: 'truck',
    poster: 'Dan M.',
    rating: '4.8',
  },
  {
    id: 'wifi',
    title: 'Wi-Fi keeps dropping in the back room',
    price: '$50',
    distance: '600 m',
    posted: '1 hr ago',
    category: 'Tech help',
    icon: 'wifi',
    poster: 'Ama O.',
    rating: '5.0',
    fresh: true,
  },
  {
    id: 'dog',
    title: 'Walk Biscuit on weekday afternoons',
    price: '$20/hr',
    distance: '350 m',
    posted: '2 hr ago',
    category: 'Pets',
    icon: 'heart',
    poster: 'Jonas K.',
    rating: '4.7',
  },
  {
    id: 'desk',
    title: 'Assemble a standing desk',
    price: '$45',
    distance: '1.5 km',
    posted: '3 hr ago',
    category: 'Assembly',
    icon: 'tool',
    poster: 'Mei L.',
    rating: '4.9',
  },
  {
    id: 'deep',
    title: 'Deep clean a two-bed flat',
    price: '$120',
    distance: '1.8 km',
    posted: '5 hr ago',
    category: 'Cleaning',
    icon: 'droplet',
    poster: 'Rosa B.',
    rating: '4.8',
  },
  {
    id: 'hedge',
    title: 'Trim the front hedge and clear cuttings',
    price: '$40',
    distance: '700 m',
    posted: '6 hr ago',
    category: 'Yard',
    icon: 'scissors',
    poster: 'Tomas V.',
    rating: '4.6',
  },
  {
    id: 'printer',
    title: 'Set up a printer on two laptops',
    price: '$25',
    distance: '1.1 km',
    posted: '7 hr ago',
    category: 'Tech help',
    icon: 'wifi',
    poster: 'Grace H.',
    rating: '5.0',
  },
  {
    id: 'boxes',
    title: 'Load a van with packed boxes',
    price: '$75',
    distance: '2 km',
    posted: '8 hr ago',
    category: 'Moving',
    icon: 'truck',
    poster: 'Ollie P.',
    rating: '4.7',
  },
];

const filters = ['All', 'Yard', 'Moving', 'Tech help', 'Pets', 'Assembly', 'Cleaning'] as const;

const useNative = Platform.OS !== 'web';

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/**
 * A browsable preview of the feed, the way a marketplace shows its goods
 * before you sign up: filter the categories, scan the cards, and the first
 * tap asks you to create an account.
 */
export default function TaskFeed({ onOpenTask }: { onOpenTask: () => void }) {
  const { width, isMd, isLg } = useBreakpoint();
  const [active, setActive] = useState<(typeof filters)[number]>('All');

  const visible = useMemo(
    () => (active === 'All' ? tasks : tasks.filter((t) => t.category === active)),
    [active],
  );

  const columns = isLg ? 3 : isMd ? 2 : 1;
  const gap = 20;
  const gutter = isMd ? 40 : 22;
  const contentWidth = Math.min(width, 1120) - gutter * 2;
  const cardWidth = (contentWidth - gap * (columns - 1)) / columns;

  return (
    <View>
      <View style={[styles.head, isMd && styles.headRow]}>
        <View style={styles.headText}>
          <Text style={styles.title}>Open near you</Text>
          <View style={styles.place}>
            <Feather name="map-pin" size={15} color={colors.clover} />
            <Text style={styles.placeText}>
              {visible.length} {visible.length === 1 ? 'task' : 'tasks'} within 2 km of Riverside
            </Text>
          </View>
        </View>
        <Pressable
          onPress={onOpenTask}
          accessibilityRole="button"
          accessibilityLabel="Browse every open task"
          style={styles.browse}
        >
          <Text style={styles.browseText}>Browse everything</Text>
          <Feather name="arrow-right" size={16} color={colors.clover} />
        </Pressable>
      </View>

      <View style={styles.filters}>
        {filters.map((f) => {
          const on = f === active;
          return (
            <Pressable
              key={f}
              onPress={() => setActive(f)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`Show ${f === 'All' ? 'all tasks' : f.toLowerCase()} tasks`}
              style={[styles.chip, on && styles.chipOn, webOnly({ cursor: 'pointer' })]}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{f}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.grid, { gap }]}>
        {visible.map((task) => (
          <TaskCard key={task.id} task={task} width={cardWidth} onPress={onOpenTask} />
        ))}
      </View>
    </View>
  );
}

function TaskCard({ task, width, onPress }: { task: Task; width: number; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) =>
    Animated.spring(scale, { toValue: value, useNativeDriver: useNative, speed: 40, bounciness: 4 }).start();

  return (
    <Animated.View style={{ width, transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animateTo(0.98)}
        onPressOut={() => animateTo(1)}
        accessibilityRole="button"
        accessibilityLabel={`${task.title}, ${task.price}, ${task.distance} away, posted by ${task.poster}`}
        style={[styles.card, webOnly({ cursor: 'pointer' })]}
      >
        <View style={styles.thumb}>
          <View style={styles.thumbRingA} />
          <View style={styles.thumbRingB} />
          <Feather name={task.icon} size={26} color={colors.clover} />
          <View style={styles.price}>
            <Text style={styles.priceText}>{task.price}</Text>
          </View>
          {task.fresh && (
            <View style={styles.fresh}>
              <View style={styles.freshDot} />
              <Text style={styles.freshText}>Just posted</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {task.title}
          </Text>
          <Text style={styles.meta}>
            {task.distance} away, {task.posted}
          </Text>
          <View style={styles.poster}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(task.poster)}</Text>
            </View>
            <Text style={styles.posterName} numberOfLines={1}>
              {task.poster}
            </Text>
            <View style={styles.rating}>
              <Feather name="star" size={13} color={colors.marigold} />
              <Text style={styles.ratingText}>{task.rating}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  head: { gap: 16 },
  headRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  headText: { gap: 8 },
  title: { ...type.h1, fontFamily: font.bold, color: colors.ink },
  place: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  placeText: { ...type.body, fontFamily: font.regular, color: colors.inkSoft },
  browse: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  browseText: { ...type.body, fontFamily: font.semibold, color: colors.clover },

  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 24 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
  },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { ...type.small, fontFamily: font.medium, color: colors.inkSoft },
  chipTextOn: { fontFamily: font.semibold, color: colors.paper },

  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 24 },
  card: {
    borderRadius: radius.panel,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    ...shadow.soft,
  },
  thumb: {
    height: 136,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbRingA: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1.5,
    borderColor: colors.mintLine,
  },
  thumbRingB: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1.5,
    borderColor: colors.mintLine,
  },
  price: {
    position: 'absolute',
    left: 14,
    top: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    ...shadow.soft,
  },
  priceText: { ...type.small, fontFamily: font.bold, color: colors.clover },
  fresh: {
    position: 'absolute',
    right: 14,
    top: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    ...shadow.soft,
  },
  freshDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.marigold },
  freshText: { ...type.tiny, fontFamily: font.medium, color: colors.inkSoft },

  body: { padding: 18, gap: 6 },
  cardTitle: { ...type.h3, fontFamily: font.semibold, color: colors.ink, minHeight: 48 },
  meta: { ...type.small, fontFamily: font.regular, color: colors.inkFaint },
  poster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: font.bold, fontSize: 11.5, color: colors.clover },
  posterName: { ...type.small, fontFamily: font.medium, color: colors.inkSoft, flex: 1 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { ...type.small, fontFamily: font.semibold, color: colors.ink },
});
