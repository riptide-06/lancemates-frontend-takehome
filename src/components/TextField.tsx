import Feather from '@expo/vector-icons/Feather';
import { forwardRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { colors, font, radius, shadow, type, webOnly } from '../theme/tokens';

interface Props extends Omit<TextInputProps, 'style' | 'secureTextEntry'> {
  label: string;
  error?: string;
  /** Shown beneath the field when there's no error. */
  hint?: string;
  /** Renders the eye toggle and masks input until revealed. */
  password?: boolean;
  /** Optional right-aligned element in the label row, e.g. "Forgot password?". */
  labelAccessory?: React.ReactNode;
}

/**
 * One field component for every input in the app. The focus ring, error
 * ring and password toggle all live here so the forms stay declarative.
 */
const TextField = forwardRef<TextInput, Props>(function TextField(
  { label, error, hint, password, labelAccessory, multiline, onFocus, onBlur, ...inputProps },
  ref
) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const ringStyle = error ? shadow.focusDanger : focused ? shadow.focus : undefined;
  const borderColor = error ? colors.danger : focused ? colors.clover : colors.line;

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {labelAccessory}
      </View>

      <View
        style={[
          styles.field,
          multiline && styles.fieldMultiline,
          { borderColor },
          (focused || error) && ringStyle,
        ]}
      >
        <TextInput
          ref={ref}
          {...inputProps}
          multiline={multiline}
          secureTextEntry={password && !revealed}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          placeholderTextColor={colors.inkFaint}
          accessibilityLabel={label}
          accessibilityHint={error}
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            webOnly({ outlineStyle: 'none' }),
          ]}
        />
        {password && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
            onPress={() => setRevealed((v) => !v)}
            hitSlop={8}
            style={({ pressed }) => [styles.eye, pressed && styles.eyePressed]}
          >
            <Feather name={revealed ? 'eye-off' : 'eye'} size={19} color={colors.inkSoft} />
          </Pressable>
        )}
      </View>

      {error ? (
        <View style={styles.messageRow} accessibilityLiveRegion="polite">
          <Feather name="alert-circle" size={14} color={colors.danger} />
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
});

export default TextField;

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  labelRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  label: { ...type.small, fontFamily: font.medium, color: colors.ink },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    borderRadius: radius.input,
    borderWidth: 1.5,
    backgroundColor: colors.paper,
    paddingLeft: 16,
    paddingRight: 8,
  },
  fieldMultiline: { alignItems: 'flex-start', minHeight: 124, paddingVertical: 12 },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    ...type.body,
    fontFamily: font.regular,
    color: colors.ink,
    paddingVertical: Platform.OS === 'web' ? 0 : 12,
  },
  inputMultiline: { minHeight: 100, textAlignVertical: 'top', paddingTop: 0 },
  eye: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  eyePressed: { backgroundColor: colors.mint },
  messageRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  error: { ...type.small, fontFamily: font.regular, color: colors.danger, flexShrink: 1 },
  hint: { ...type.small, fontFamily: font.regular, color: colors.inkSoft },
});
