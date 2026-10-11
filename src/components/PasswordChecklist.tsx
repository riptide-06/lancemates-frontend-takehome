import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, View } from 'react-native';

import { colors, font, type } from '../theme/tokens';
import { passwordRules } from '../utils/validation';

interface Props {
  password: string;
}

/**
 * The rules are visible before you type, so nobody discovers them from an
 * error message, and each one ticks off as it's met.
 */
export default function PasswordChecklist({ password }: Props) {
  return (
    <View style={styles.grid} accessibilityRole="list">
      {passwordRules.map((rule) => {
        const met = rule.test(password);
        return (
          <View key={rule.id} style={styles.item} accessibilityLabel={`${rule.label}: ${met ? 'met' : 'not met'}`}>
            <View style={[styles.dot, met && styles.dotMet]}>
              {met && <Feather name="check" size={11} color={colors.paper} />}
            </View>
            <Text style={[styles.label, met && styles.labelMet]}>{rule.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8, marginTop: 2 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '50%', minWidth: 170 },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.mintLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotMet: { backgroundColor: colors.clover, borderColor: colors.clover },
  label: { ...type.tiny, fontSize: 13, lineHeight: 18, fontFamily: font.regular, color: colors.inkSoft },
  labelMet: { color: colors.ink, fontFamily: font.medium },
});
