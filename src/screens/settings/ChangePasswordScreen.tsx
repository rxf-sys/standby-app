import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Lock } from 'lucide-react-native';
import { RootStackParamList } from '@/navigation/types';
import { Button, Input } from '@/components/common';
import { useUpdatePassword } from '@/hooks/useAuth';
import { theme } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ChangePassword'>;

export const ChangePasswordScreen: React.FC<Props> = ({ navigation }) => {
  const updatePasswordMutation = useUpdatePassword();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword.trim()) {
      Alert.alert('Fehler', 'Bitte gib dein aktuelles Passwort ein');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Fehler', 'Bitte gib ein neues Passwort ein');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Fehler', 'Das Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Fehler', 'Die Passwörter stimmen nicht überein');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Fehler', 'Das neue Passwort muss sich vom alten unterscheiden');
      return;
    }

    updatePasswordMutation.mutate(newPassword, {
      onSuccess: () => {
        Alert.alert('Erfolg', 'Passwort wurde erfolgreich geändert', [
          {
            text: 'OK',
            onPress: () => {
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              navigation.goBack();
            },
          },
        ]);
      },
      onError: (error: any) => {
        Alert.alert(
          'Fehler',
          error?.message || 'Passwort konnte nicht geändert werden'
        );
        console.error('Error changing password:', error);
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Lock color={theme.colors.primary} size={32} />
          </View>
          <Text style={styles.headerTitle}>Passwort ändern</Text>
          <Text style={styles.headerSubtitle}>
            Wähle ein sicheres Passwort mit mindestens 8 Zeichen
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Aktuelles Passwort *"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Aktuelles Passwort eingeben"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Neues Passwort *"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Mindestens 8 Zeichen"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Passwort bestätigen *"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Neues Passwort wiederholen"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Password Requirements */}
          <View style={styles.requirementsBox}>
            <Text style={styles.requirementsTitle}>Passwort-Anforderungen:</Text>
            <Text style={styles.requirementItem}>• Mindestens 8 Zeichen</Text>
            <Text style={styles.requirementItem}>
              • Mindestens 1 Großbuchstabe (empfohlen)
            </Text>
            <Text style={styles.requirementItem}>
              • Mindestens 1 Zahl (empfohlen)
            </Text>
            <Text style={styles.requirementItem}>
              • Mindestens 1 Sonderzeichen (empfohlen)
            </Text>
          </View>
        </View>

        <Button
          title="Passwort ändern"
          onPress={handleChangePassword}
          loading={updatePasswordMutation.isPending}
          fullWidth
          style={styles.submitButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: theme.spacing.md,
  },
  requirementsBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  requirementsTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  requirementItem: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  submitButton: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
});
