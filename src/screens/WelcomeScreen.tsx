import Feather from '@expo/vector-icons/Feather';
import { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';

import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import { colors, font, type } from '../theme/tokens';
import { useReducedMotion } from '../utils/hooks';

export interface SessionUser {
  email: string;
  name?: string;
  isNew: boolean;
}

interface Props {
  user: SessionUser;
  onLogOut: () => void;
}

const useNative = Platform.OS !== 'web';

/**
 * The success state for both forms. The check pops in because it answers
 * the thing you just did; everything else stays still.
 */
export default function WelcomeScreen({ user, onLogOut }: Props) {
  const reduced = useReducedMotion();
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) {
      pop.setValue(1);
      return;
    }
    Animated.spring(pop, { toValue: 1, useNativeDriver: useNative, speed: 12, bounciness: 12 }).start();
  }, [reduced, pop]);

  const firstName = user.name?.split(' ')[0];
  const title = user.isNew && firstName ? `Welcome, ${firstName}.` : 'You’re signed in.';
  const subtitle = user.isNew
    ? 'Your account is ready. Post your first task, or browse what’s nearby.'
    : `Logged in as ${user.email}. Let’s see what’s happening nearby.`;

  return (
    <AuthLayout title={title} subtitle={subtitle} onBack={onLogOut} hideBack>
      <View style={styles.body}>
        <Animated.View
          style={[
            styles.check,
            {
              opacity: pop,
              transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }],
            },
          ]}
        >
          <Feather name="check" size={34} color={colors.paper} />
        </Animated.View>

        <View style={styles.next}>
          <Text style={styles.nextTitle}>Good next steps</Text>
          {(user.isNew
            ? ['Add a photo so neighbors know who to expect', 'Post your first task', 'Browse tasks within 2 km']
            : ['Check messages from your mates', 'Browse new tasks within 2 km']
          ).map((item) => (
            <View key={item} style={styles.nextRow}>
              <View style={styles.nextDot} />
              <Text style={styles.nextText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button label="Back to home" size="lg" fullWidth onPress={onLogOut} />
          <Button label="Log out" variant="ghost" fullWidth onPress={onLogOut} />
        </View>
        <Text style={styles.demo}>This is a demo. Nothing was sent anywhere.</Text>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  body: { gap: 28 },
  check: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.clover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  next: { gap: 10, backgroundColor: colors.mint, borderRadius: 20, padding: 20 },
  nextTitle: { ...type.small, fontFamily: font.semibold, color: colors.ink, marginBottom: 2 },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nextDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.marigold },
  nextText: { ...type.body, fontSize: 15, fontFamily: font.regular, color: colors.inkSoft, flexShrink: 1 },
  actions: { gap: 8 },
  demo: { ...type.tiny, fontFamily: font.regular, color: colors.inkFaint, textAlign: 'center' },
});
