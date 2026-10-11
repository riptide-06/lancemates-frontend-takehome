import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import PasswordChecklist from '../components/PasswordChecklist';
import TextField from '../components/TextField';
import TextLink from '../components/TextLink';
import { colors, font, type } from '../theme/tokens';
import { validateEmail, validateName, validateSignUpPassword, wait } from '../utils/validation';

export interface SignUpResult {
  name: string;
  email: string;
  about: string;
}

interface Props {
  onToLogin: () => void;
  onBack: () => void;
  onSignUpSuccess: (result: SignUpResult) => void;
}

type Field = 'name' | 'email' | 'password';

const ABOUT_MAX = 280;

export default function SignUpScreen({ onToLogin, onBack, onSignUpSuccess }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [about, setAbout] = useState('');
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const aboutRef = useRef<TextInput>(null);

  const errors = {
    name: touched.name ? validateName(name) : undefined,
    email: touched.email ? validateEmail(email) : undefined,
    password: touched.password ? validateSignUpPassword(password) : undefined,
  };

  const touch = (field: Field) => setTouched((t) => ({ ...t, [field]: true }));

  const submit = async () => {
    if (submitting) return;
    setTouched({ name: true, email: true, password: true });

    if (validateName(name)) return nameRef.current?.focus();
    if (validateEmail(email)) return emailRef.current?.focus();
    if (validateSignUpPassword(password)) return passwordRef.current?.focus();

    setSubmitting(true);
    await wait(1100); // stand-in for the request
    setSubmitting(false);
    onSignUpSuccess({ name: name.trim(), email: email.trim(), about: about.trim() });
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free, and it takes about a minute."
      onBack={onBack}
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TextLink label="Log in" onPress={onToLogin} />
        </View>
      }
    >
      <View style={styles.form}>
        <TextField
          ref={nameRef}
          label="Name"
          placeholder="What should neighbors call you?"
          value={name}
          onChangeText={setName}
          onBlur={() => touch('name')}
          error={errors.name}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
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
        <View style={styles.passwordBlock}>
          <TextField
            ref={passwordRef}
            label="Password"
            placeholder="Choose a strong one"
            value={password}
            onChangeText={setPassword}
            onBlur={() => touch('password')}
            error={errors.password}
            password
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="next"
            onSubmitEditing={() => aboutRef.current?.focus()}
          />
          <PasswordChecklist password={password} />
        </View>
        <TextField
          ref={aboutRef}
          label="About you"
          labelAccessory={
            <Text style={styles.counter}>
              {about.length}/{ABOUT_MAX}
            </Text>
          }
          placeholder="What you’re good at, or what you usually need a hand with."
          hint="Optional. You can add this later from your profile."
          value={about}
          onChangeText={setAbout}
          multiline
          maxLength={ABOUT_MAX}
          returnKeyType="default"
        />
        <Button
          label="Create account"
          loadingLabel="Creating your account"
          size="lg"
          fullWidth
          loading={submitting}
          onPress={submit}
          style={styles.submit}
        />
        <Text style={styles.terms}>
          By creating an account you agree to the{' '}
          <Text style={styles.termsLink} onPress={() => undefined}>
            Terms
          </Text>{' '}
          and{' '}
          <Text style={styles.termsLink} onPress={() => undefined}>
            Privacy policy
          </Text>
          .
        </Text>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: { gap: 20 },
  passwordBlock: { gap: 12 },
  counter: { ...type.tiny, fontFamily: font.regular, color: colors.inkFaint },
  submit: { marginTop: 4 },
  terms: { ...type.tiny, fontSize: 13, lineHeight: 19, fontFamily: font.regular, color: colors.inkSoft, textAlign: 'center' },
  termsLink: { fontFamily: font.semibold, color: colors.clover },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { ...type.small, fontFamily: font.regular, color: colors.inkSoft },
});
