import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  User as UserIcon,
  Bell,
  Palette,
  Globe,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { Card } from '@/components/common';
import { useAuth, useSignOut } from '@/hooks/useAuth';
import { RootStackParamList } from '@/navigation/types';
import { theme } from '@/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const signOut = useSignOut();

  const handleLogout = () => {
    Alert.alert('Abmelden', 'Möchtest du dich wirklich abmelden?', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Abmelden',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut.mutateAsync();
          } catch (error) {
            Alert.alert('Fehler', 'Abmelden fehlgeschlagen');
          }
        },
      },
    ]);
  };

  const SettingsItem = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    showChevron = true,
  }: {
    icon: typeof UserIcon;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.settingsItem}>
        <View style={styles.settingsItemLeft}>
          <View style={styles.iconContainer}>
            <Icon color={theme.colors.primary} size={20} />
          </View>
          <View style={styles.settingsItemContent}>
            <Text style={styles.settingsItemTitle}>{title}</Text>
            {subtitle && <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        {showChevron && <ChevronRight color={theme.colors.textTertiary} size={20} />}
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Profile */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <UserIcon color={theme.colors.textInverse} size={32} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'Benutzer'}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
          </View>
        </Card>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingsItem
            icon={UserIcon}
            title="Profil bearbeiten"
            subtitle="Name, E-Mail & Foto"
            onPress={() => navigation.navigate('ProfileEdit')}
          />
          <SettingsItem
            icon={Lock}
            title="Passwort ändern"
            onPress={() => navigation.navigate('ChangePassword')}
          />
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App-Einstellungen</Text>
          <SettingsItem
            icon={Bell}
            title="Benachrichtigungen"
            subtitle="Push-Benachrichtigungen verwalten"
            onPress={() => navigation.navigate('NotificationSettings')}
          />
          <SettingsItem
            icon={Palette}
            title="Aussehen"
            subtitle="Theme & Farben"
            onPress={() => navigation.navigate('ThemeSettings')}
          />
          <SettingsItem
            icon={Globe}
            title="Sprache & Region"
            subtitle="Deutsch, EUR"
            onPress={() => Alert.alert('Info', 'Sprach-Einstellungen kommen bald')}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingsItem
            icon={HelpCircle}
            title="Hilfe & FAQ"
            onPress={() => navigation.navigate('HelpFAQ')}
          />
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
            <Card style={styles.logoutCard}>
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, styles.logoutIconContainer]}>
                  <LogOut color={theme.colors.error} size={20} />
                </View>
                <Text style={styles.logoutText}>Abmelden</Text>
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <Text style={styles.version}>Version 0.1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileCard: {
    margin: theme.spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  profileEmail: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  section: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  settingsItemSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutIconContainer: {
    backgroundColor: theme.colors.error + '20',
  },
  logoutText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.error,
  },
  version: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginVertical: theme.spacing.xl,
  },
});
