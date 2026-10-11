import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { layout } from '../theme/tokens';
import { useBreakpoint } from '../utils/hooks';

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function Container({ children, style }: Props) {
  const { isMd } = useBreakpoint();
  return (
    <View style={[styles.container, { paddingHorizontal: isMd ? 40 : 22 }, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' },
});
