import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { User as UserIcon, Camera } from 'lucide-react-native';
import { RootStackParamList } from '@/navigation/types';
import { Button, Input } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileEdit'>;

export const ProfileEditScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Fehler', 'Bitte gib einen Namen ein');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Fehler', 'Bitte gib eine E-Mail-Adresse ein');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Fehler', 'Bitte gib eine gültige E-Mail-Adresse ein');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement profile update with Supabase
      // await updateProfile({ name: name.trim(), email: email.trim() });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert('Erfolg', 'Profil wurde aktualisiert', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Fehler', 'Profil konnte nicht aktualisiert werden');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Profilbild ändern',
      'Wähle eine Option',
      [
        {
          text: 'Foto aufnehmen',
          onPress: () => Alert.alert('Info', 'Kamera-Funktion kommt bald'),
        },
        {
          text: 'Aus Galerie wählen',
          onPress: () => Alert.alert('Info', 'Galerie-Funktion kommt bald'),
        },
        { text: 'Abbrechen', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <View style={styles.avatar}>
            <UserIcon color={theme.colors.textInverse} size={48} />
          </View>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={handleChangePhoto}
            activeOpacity={0.7}
          >
            <Camera color={theme.colors.primary} size={20} />
            <Text style={styles.photoButtonText}>Foto ändern</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Name *"
            value={name}
            onChangeText={setName}
            placeholder="Dein Name"
            autoCapitalize="words"
          />

          <Input
            label="E-Mail-Adresse *"
            value={email}
            onChangeText={setEmail}
            placeholder="deine@email.de"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Hinweis: Wenn du deine E-Mail-Adresse änderst, musst du die neue Adresse bestätigen.
            </Text>
          </View>
        </View>

        <Button
          title="Änderungen speichern"
          onPress={handleSave}
          loading={loading}
          fullWidth
          style={styles.saveButton}
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
  photoSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  photoButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
  },
  form: {
    paddingHorizontal: theme.spacing.md,
  },
  infoBox: {
    backgroundColor: theme.colors.primaryLight + '20',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  saveButton: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
});
