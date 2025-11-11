import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User } from 'lucide-react-native';
import { Button, Input } from '@/components/common';
import { useSignIn, useSignUp } from '@/hooks/useAuth';
import { theme } from '@/theme';
import { isValidEmail } from '@/utils';

export const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const signIn = useSignIn();
  const signUp = useSignUp();

  const validateForm = (): boolean => {
    let isValid = true;

    if (!email || !isValidEmail(email)) {
      setEmailError('Bitte gib eine gültige E-Mail ein');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password || password.length < 6) {
      setPasswordError('Passwort muss mindestens 6 Zeichen lang sein');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isLogin) {
        await signIn.mutateAsync({ email, password });
      } else {
        if (!name.trim()) {
          Alert.alert('Fehler', 'Bitte gib deinen Namen ein');
          return;
        }
        await signUp.mutateAsync({ email, password, name });
        Alert.alert(
          'Erfolg',
          'Registrierung erfolgreich! Bitte bestätige deine E-Mail-Adresse.'
        );
      }
    } catch (error: any) {
      Alert.alert('Fehler', error.message || 'Ein Fehler ist aufgetreten');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmailError('');
    setPasswordError('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🏠 StandBy</Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? 'Willkommen zurück!'
                : 'Starte dein selbstständiges Leben'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {!isLogin && (
              <Input
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Dein Name"
                leftIcon={<User color={theme.colors.textSecondary} size={20} />}
                autoCapitalize="words"
              />
            )}

            <Input
              label="E-Mail"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              placeholder="deine@email.de"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail color={theme.colors.textSecondary} size={20} />}
              error={emailError}
            />

            <Input
              label="Passwort"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              placeholder={isLogin ? 'Dein Passwort' : 'Mindestens 6 Zeichen'}
              secureTextEntry
              leftIcon={<Lock color={theme.colors.textSecondary} size={20} />}
              error={passwordError}
            />

            <Button
              title={isLogin ? 'Anmelden' : 'Registrieren'}
              onPress={handleSubmit}
              loading={signIn.isPending || signUp.isPending}
              fullWidth
              style={styles.submitButton}
            />

            {/* Toggle Mode */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>
                {isLogin ? 'Noch kein Konto?' : 'Bereits registriert?'}
              </Text>
              <Button
                title={isLogin ? 'Registrieren' : 'Anmelden'}
                onPress={toggleMode}
                variant="ghost"
              />
            </View>
          </View>

          {/* Features */}
          {!isLogin && (
            <View style={styles.features}>
              <Text style={styles.featuresTitle}>Was dich erwartet:</Text>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>💰</Text>
                <Text style={styles.featureText}>Budget-Tracking & Sparziele</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🍳</Text>
                <Text style={styles.featureText}>300+ günstige Rezepte</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📅</Text>
                <Text style={styles.featureText}>Terminplanung & Erinnerungen</Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
    marginTop: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  submitButton: {
    marginTop: theme.spacing.lg,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  toggleText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  features: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.lg,
  },
  featuresTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  featureIcon: {
    fontSize: theme.typography.fontSize.xl,
    marginRight: theme.spacing.sm,
  },
  featureText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
});
