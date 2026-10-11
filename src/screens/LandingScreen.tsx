import Feather from '@expo/vector-icons/Feather';
import { useEffect, useRef } from 'react';
import { Animated, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Button from '../components/Button';
import Container from '../components/Container';
import Logo from '../components/Logo';
import NeighborhoodBoard from '../components/NeighborhoodBoard';
import TaskFeed from '../components/TaskFeed';
import TextLink from '../components/TextLink';
import { colors, font, layout, radius, type } from '../theme/tokens';
import { useBreakpoint, useReducedMotion } from '../utils/hooks';

export type AuthScreen = 'login' | 'signup';

interface Props {
  onNavigate: (screen: AuthScreen) => void;
}

const stats = [
  { value: '12,400', label: 'active members' },
  { value: '38,000', label: 'tasks posted' },
  { value: '97%', label: 'would book again' },
];

const steps = [
  {
    title: 'Create an account',
    body: 'Takes about a minute. Tell us who you are and roughly where you are.',
  },
  {
    title: 'Post or browse',
    body: 'Describe what you need done, or browse tasks posted a short walk away.',
  },
  {
    title: 'Connect and complete',
    body: 'Agree the details in chat, get it done, and pay right in the app.',
  },
];

const sides = [
  {
    icon: 'clipboard' as const,
    title: 'Need something done',
    points: [
      'Post a task in under a minute',
      'See who’s nearby and what they charge',
      'Pay only when it’s finished',
    ],
    dark: false,
  },
  {
    icon: 'map-pin' as const,
    title: 'Have time or a skill',
    points: ['Browse tasks within walking distance', 'Set your own rates', 'Get paid the same day'],
    dark: true,
  },
];

const footerLinks = ['About', 'Safety', 'Help center', 'Terms', 'Privacy'];

const useNative = Platform.OS !== 'web';

export default function LandingScreen({ onNavigate }: Props) {
  const { width, isMd, isLg } = useBreakpoint();
  const reduced = useReducedMotion();
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) {
      entrance.setValue(1);
      return;
    }
    Animated.timing(entrance, { toValue: 1, duration: 520, useNativeDriver: useNative }).start();
  }, [reduced, entrance]);

  const gutter = isMd ? 40 : 22;
  const contentWidth = Math.min(width, layout.maxWidth) - gutter * 2;
  const boardSize = isLg
    ? Math.min(440, Math.max(320, Math.round((contentWidth - 56) * 0.46)))
    : Math.min(440, contentWidth);

  const heroTextStyle = {
    opacity: entrance,
    transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
  };

  return (
    <View style={styles.page}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scroll} stickyHeaderIndices={[0]}>
        {/* Nav — sticky */}
        <View style={styles.navWrap}>
          <Container style={styles.nav}>
            <Logo />
            <View style={styles.navActions}>
              <Button label="Log in" variant="ghost" onPress={() => onNavigate('login')} />
              <Button label="Sign up" onPress={() => onNavigate('signup')} />
            </View>
          </Container>
        </View>

        {/* Hero */}
        <Container style={[styles.hero, isLg ? styles.heroRow : styles.heroStack]}>
          <Animated.View style={[styles.heroText, isLg && styles.heroTextWide, heroTextStyle]}>
            <Text style={[styles.headline, !isLg && styles.headlineSm]}>
              Find help or lend a hand, right around the corner.
            </Text>
            <Text style={styles.lead}>
              Lancemates is a local gig marketplace. Post a task and a neighbor picks it up. Or pick
              up work a few streets from home.
            </Text>
            <View style={styles.ctaRow}>
              <Button label="Get started free" size="lg" onPress={() => onNavigate('signup')} />
              <Button label="Log in" size="lg" variant="secondary" onPress={() => onNavigate('login')} />
            </View>
            <View style={[styles.stats, !isMd && styles.statsStack]}>
              {stats.map((s) => (
                <View key={s.label} style={!isMd && styles.statInline}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <View style={[styles.boardWrap, !isLg && styles.boardWrapStack]}>
            <NeighborhoodBoard size={boardSize} />
          </View>
        </Container>

        {/* Live feed preview */}
        <Container style={styles.section}>
          <TaskFeed onOpenTask={() => onNavigate('signup')} />
        </Container>

        {/* How it works */}
        <Container style={styles.section}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <Text style={styles.sectionLead}>Three steps, whichever side of the job you’re on.</Text>
          <View style={[styles.steps, isLg ? styles.stepsRow : styles.stepsStack]}>
            {steps.map((step, i) => {
              const last = i === steps.length - 1;
              return (
                <View key={step.title} style={[styles.step, isLg ? styles.stepCol : styles.stepRow]}>
                  {!last && <View style={isLg ? styles.routeH : styles.routeV} />}
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{i + 1}</Text>
                  </View>
                  <View style={styles.stepBody}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepText}>{step.body}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Container>

        {/* Both sides */}
        <Container style={styles.section}>
          <Text style={styles.sectionTitle}>Built for both sides of the job</Text>
          <View style={[styles.sides, isMd && styles.sidesRow]}>
            {sides.map((side) => (
              <View key={side.title} style={[styles.side, side.dark ? styles.sideDark : styles.sideLight]}>
                <View style={[styles.sideIcon, side.dark && styles.sideIconDark]}>
                  <Feather name={side.icon} size={20} color={side.dark ? colors.marigold : colors.clover} />
                </View>
                <Text style={[styles.sideTitle, side.dark && styles.onDark]}>{side.title}</Text>
                <View style={styles.points}>
                  {side.points.map((p) => (
                    <View key={p} style={styles.point}>
                      <Feather name="check" size={16} color={side.dark ? colors.marigold : colors.clover} />
                      <Text style={[styles.pointText, side.dark && styles.onDarkSoft]}>{p}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </Container>

        {/* Final CTA */}
        <Container style={styles.section}>
          <View style={[styles.cta, isMd && styles.ctaWide]}>
            <View style={styles.ctaRingA} />
            <View style={styles.ctaRingB} />
            <View style={styles.ctaText}>
              <Text style={[styles.ctaTitle, !isMd && styles.ctaTitleSm]}>Ready to get started?</Text>
              <Text style={styles.ctaLead}>Join 12,400 neighbors already helping each other out.</Text>
            </View>
            <Button
              label="Create a free account"
              size="lg"
              variant="onDark"
              onPress={() => onNavigate('signup')}
            />
          </View>
        </Container>

        {/* Footer */}
        <View style={styles.footerWrap}>
          <Container style={[styles.footer, isMd && styles.footerRow]}>
            <View style={styles.footerBrand}>
              <Logo size={20} />
              <Text style={styles.copyright}>© 2026 Lancemates</Text>
            </View>
            <View style={styles.footerLinks}>
              {footerLinks.map((l) => (
                <TextLink key={l} label={l} tone="quiet" onPress={() => undefined} />
              ))}
            </View>
          </Container>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  scroll: { flex: 1 },

  navWrap: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  nav: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  hero: { paddingTop: 40, paddingBottom: 24 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 56, paddingTop: 64, paddingBottom: 40 },
  heroStack: { alignItems: 'stretch', gap: 40 },
  heroText: { maxWidth: 560 },
  heroTextWide: { flex: 1 },
  headline: { ...type.display, fontFamily: font.extrabold, color: colors.ink },
  headlineSm: { ...type.displaySm, fontFamily: font.extrabold },
  lead: { ...type.lead, fontFamily: font.regular, color: colors.inkSoft, marginTop: 20, maxWidth: 520 },
  ctaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 32 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 36, rowGap: 16, marginTop: 40 },
  statsStack: { flexDirection: 'column', rowGap: 10, marginTop: 32 },
  statInline: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  statValue: { ...type.h2, fontFamily: font.bold, color: colors.ink },
  statLabel: { ...type.small, fontFamily: font.regular, color: colors.inkSoft, marginTop: 2 },
  boardWrap: { alignItems: 'flex-end' },
  boardWrapStack: { alignItems: 'center' },

  section: { paddingVertical: 48 },
  sectionTitle: { ...type.h1, fontFamily: font.bold, color: colors.ink },
  sectionLead: { ...type.body, fontFamily: font.regular, color: colors.inkSoft, marginTop: 8 },

  steps: { marginTop: 36 },
  stepsRow: { flexDirection: 'row', gap: 40 },
  stepsStack: { gap: 28 },
  step: { position: 'relative' },
  stepCol: { flex: 1, gap: 18 },
  stepRow: { flexDirection: 'row', gap: 18, alignItems: 'flex-start' },
  routeH: {
    position: 'absolute',
    top: 17,
    left: 44,
    right: -32,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.mintLine,
  },
  routeV: {
    position: 'absolute',
    left: 17,
    top: 44,
    bottom: -20,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.mintLine,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { fontFamily: font.bold, fontSize: 15, color: colors.clover },
  stepBody: { flex: 1, gap: 6, paddingTop: 5 },
  stepTitle: { ...type.h3, fontFamily: font.semibold, color: colors.ink },
  stepText: { ...type.body, fontSize: 15, lineHeight: 23, fontFamily: font.regular, color: colors.inkSoft },

  sides: { marginTop: 32, gap: 20 },
  sidesRow: { flexDirection: 'row' },
  side: { flex: 1, borderRadius: radius.panel, padding: 28, gap: 18 },
  sideLight: { backgroundColor: colors.mint },
  sideDark: { backgroundColor: colors.ink },
  sideIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideIconDark: { backgroundColor: 'rgba(255,255,255,0.1)' },
  sideTitle: { ...type.h2, fontFamily: font.bold, color: colors.ink },
  points: { gap: 12 },
  point: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pointText: { ...type.body, fontSize: 15.5, fontFamily: font.regular, color: colors.inkSoft, flexShrink: 1 },
  onDark: { color: colors.paper },
  onDarkSoft: { color: 'rgba(255,255,255,0.78)' },

  cta: {
    backgroundColor: colors.clover,
    borderRadius: radius.hero,
    padding: 32,
    gap: 24,
    overflow: 'hidden',
  },
  ctaWide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
    paddingVertical: 44,
  },
  ctaRingA: {
    position: 'absolute',
    right: -120,
    top: -160,
    width: 380,
    height: 380,
    borderRadius: 190,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  ctaRingB: {
    position: 'absolute',
    right: -20,
    top: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  ctaText: { flexShrink: 1, gap: 8, maxWidth: 520 },
  ctaTitle: { ...type.h1, fontFamily: font.bold, color: colors.paper },
  ctaTitleSm: { ...type.h2, fontSize: 28, lineHeight: 34 },
  ctaLead: { ...type.body, fontFamily: font.regular, color: 'rgba(255,255,255,0.84)' },

  footerWrap: { borderTopWidth: 1, borderTopColor: colors.line, marginTop: 24 },
  footer: { paddingVertical: 32, gap: 20 },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footerBrand: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  copyright: { ...type.small, fontFamily: font.regular, color: colors.inkSoft },
  footerLinks: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 24, rowGap: 10 },
});
