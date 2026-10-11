import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import TextField from '../components/TextField';
import TextLink from '../components/TextLink';
import { colors, font, type } from '../theme/tokens';
import { validateEmail, validateLoginPassword, wait } from '../utils/validation';

export interface LoginResult {
  email: string;
}

interface Props {
  onToSignUp: () => void;
  onBack: () => void;
  onLoginSuccess: (result: LoginResult) => void;
}

type Field = 'email' | 'password';

/**
 * Fields validate when you leave them, then re-validate as you type so the
 * message clears the moment it's fixed. Submit validates everything and
 * moves focus to the first problem.
 */
export default function LoginScreen({ onToSignUp, onBack, onLoginSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const errors = {
    email: touched.email ? validateEmail(email) : undefined,
    password: touched.password ? validateLoginPassword(password) : undefined,
  };

  const touch = (field: Field) => setTouched((t) => ({ ...t, [field]: true }));

  const submit = async () => {
    if (submitting) return;
    setTouched({ email: true, password: true });

    if (validateEmail(email)) return emailRef.current?.focus();
    if (validateLoginPassword(password)) return passwordRef.current?.focus();

    setSubmitting(true);
    await wait(900); // stand-in for the request
    setSubmitting(false);
    onLoginSuccess({ email: email.trim() });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to see what’s happening nearby."
      onBack={onBack}
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New here?</Text>
          <TextLink label="Create an account" onPress={onToSignUp} />
        </View>
      }
    >
      <View style={styles.form}>
        <TextField
          ref={emailRef}
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          onBlur={() => touch('email')}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <TextField
          ref={passwordRef}
          label="Password"
          labelAccessory={<TextLink label="Forgot password?" onPress={() => undefined} />}
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          onBlur={() => touch('password')}
          error={errors.password}
          password
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        <Button
          label="Log in"
          loadingLabel="Logging in"
          size="lg"
          fullWidth
          loading={submitting}
          onPress={submit}
          style={styles.submit}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: { gap: 20 },
  submit: { marginTop: 4 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { ...type.small, fontFamily: font.regular, color: colors.inkSoft },
});
