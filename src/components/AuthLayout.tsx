import Feather from '@expo/vector-icons/Feather';
import { ReactNode, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { colors, font, radius, shadow, type } from '../theme/tokens';
import { useBreakpoint } from '../utils/hooks';
import Logo from './Logo';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Rendered beneath the card, e.g. "New here? Create an account". */
  footer?: ReactNode;
  onBack: () => void;
  /** Hide the "Back to home" link (used on the signed-in screen). */
  hideBack?: boolean;
}

/**
 * Auth screens share one shell: brand top-left, a way home top-right, and a
 * single rounded card. On phones the card gives up its chrome and becomes
 * the page.
 */
export default function AuthLayout({ title, subtitle, children, footer, onBack, hideBack }: Props) {
  const { isMd } = useBreakpoint();
  const [backHovered, setBackHovered] = useState(false);

  return (
    <KeyboardAvoidingView
      style={[styles.page, { backgroundColor: isMd ? colors.paperTint : colors.paper }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingHorizontal: isMd ? 40 : 22 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topBar}>
          <Logo onPress={onBack} />
          {!hideBack && (
            <Pressable
              accessibilityRole="link"
              onPress={onBack}
              hitSlop={8}
              onHoverIn={() => setBackHovered(true)}
              onHoverOut={() => setBackHovered(false)}
              style={({ pressed }) => [styles.back, (pressed || backHovered) && styles.backActive]}
            >
              <Feather name="chevron-left" size={16} color={colors.inkSoft} />
              <Text style={styles.backText}>Back to home</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.center}>
          <View style={[styles.card, isMd && styles.cardElevated]}>
            <Text style={[styles.title, !isMd && styles.titleSm]}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            <View style={styles.body}>{children}</View>
          </View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingTop: 20, paddingBottom: 48 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 14,
    borderRadius: radius.pill,
  },
  backActive: { backgroundColor: colors.mint },
  backText: { ...type.small, fontFamily: font.medium, color: colors.inkSoft },
  center: { flex: 1, justifyContent: 'center', paddingVertical: 32 },
  card: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  cardElevated: {
    backgroundColor: colors.paper,
    borderRadius: radius.panel,
    paddingHorizontal: 40,
    paddingVertical: 40,
    ...shadow.card,
  },
  title: { ...type.h1, fontFamily: font.bold, color: colors.ink },
  titleSm: { ...type.h2, fontSize: 28, lineHeight: 34 },
  subtitle: { ...type.body, fontFamily: font.regular, color: colors.inkSoft, marginTop: 8 },
  body: { marginTop: 28 },
  footer: { alignSelf: 'center', marginTop: 24 },
});
