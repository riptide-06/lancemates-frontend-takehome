import {
  Sora_400Regular,
  Sora_500Medium,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/sora';
import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';

import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import WelcomeScreen, { SessionUser } from './src/screens/WelcomeScreen';
import { colors } from './src/theme/tokens';

type Screen = 'landing' | 'login' | 'signup' | 'welcome';

const useNative = Platform.OS !== 'web';

/**
 * App root. Minimal screen switcher with a short cross-fade — swap for a
 * real navigation library (expo-router / react-navigation) once the app grows.
 */
export default function App() {
  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_500Medium,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
  });

  const [screen, setScreen] = useState<Screen>('landing');
  const [user, setUser] = useState<SessionUser | null>(null);

  // The screen actually on stage. It trails `screen` by one fade-out.
  const [staged, setStaged] = useState<Screen>('landing');
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (screen === staged) return;
    Animated.timing(opacity, { toValue: 0, duration: 110, useNativeDriver: useNative }).start(() => {
      setStaged(screen);
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: useNative }).start();
    });
  }, [screen, staged, opacity]);

  const signIn = (next: SessionUser) => {
    setUser(next);
    setScreen('welcome');
  };

  const signOut = () => {
    setUser(null);
    setScreen('landing');
  };

  if (!fontsLoaded) return <View style={styles.blank} />;

  return (
    <Animated.View style={[styles.root, { opacity }]}>
      {staged === 'landing' && <LandingScreen onNavigate={setScreen} />}
      {staged === 'login' && (
        <LoginScreen
          onToSignUp={() => setScreen('signup')}
          onBack={() => setScreen('landing')}
          onLoginSuccess={({ email }) => signIn({ email, isNew: false })}
        />
      )}
      {staged === 'signup' && (
        <SignUpScreen
          onToLogin={() => setScreen('login')}
          onBack={() => setScreen('landing')}
          onSignUpSuccess={({ name, email }) => signIn({ name, email, isNew: true })}
        />
      )}
      {staged === 'welcome' && user && <WelcomeScreen user={user} onLogOut={signOut} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  blank: { flex: 1, backgroundColor: colors.paper },
});
