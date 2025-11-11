import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Bell, Calendar, TrendingUp, ChefHat } from 'lucide-react-native';
import { RootStackParamList } from '@/navigation/types';
import { Card } from '@/components/common';
import { theme } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationSettings'>;

export const NotificationSettingsScreen: React.FC<Props> = () => {
  // Global
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  // Budget
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [savingsGoalReminders, setSavingsGoalReminders] = useState(true);
  const [transactionNotifications, setTransactionNotifications] = useState(false);

  // Calendar
  const [eventReminders, setEventReminders] = useState(true);
  const [dayBeforeReminder, setDayBeforeReminder] = useState(true);

  // Recipes
  const [mealPlanReminders, setMealPlanReminders] = useState(false);
  const [shoppingListReminders, setShoppingListReminders] = useState(false);

  const NotificationSection = ({
    icon: Icon,
    title,
    subtitle,
    children,
  }: {
    icon: typeof Bell;
    title: string;
    subtitle: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Icon color={theme.colors.primary} size={20} />
        </View>
        <View style={styles.sectionHeaderContent}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Card style={styles.settingsCard}>{children}</Card>
    </View>
  );

  const SettingRow = ({
    label,
    description,
    value,
    onValueChange,
    disabled = false,
  }: {
    label: string;
    description?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
  }) => (
    <View
      style={[
        styles.settingRow,
        disabled && styles.settingRowDisabled,
      ]}
    >
      <View style={styles.settingContent}>
        <Text
          style={[
            styles.settingLabel,
            disabled && styles.settingLabelDisabled,
          ]}
        >
          {label}
        </Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.primary,
        }}
        thumbColor={theme.colors.surface}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Bell color={theme.colors.primary} size={32} />
          </View>
          <Text style={styles.headerTitle}>Benachrichtigungen</Text>
          <Text style={styles.headerSubtitle}>
            Verwalte deine Benachrichtigungseinstellungen
          </Text>
        </View>

        {/* Global Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>Allgemein</Text>
          <Card style={styles.settingsCard}>
            <SettingRow
              label="Push-Benachrichtigungen"
              description="Erhalte Benachrichtigungen auf diesem Gerät"
              value={pushNotifications}
              onValueChange={setPushNotifications}
            />
            <View style={styles.divider} />
            <SettingRow
              label="E-Mail-Benachrichtigungen"
              description="Erhalte wichtige Updates per E-Mail"
              value={emailNotifications}
              onValueChange={setEmailNotifications}
            />
          </Card>
        </View>

        {/* Budget Notifications */}
        <NotificationSection
          icon={TrendingUp}
          title="Budget"
          subtitle="Finanzielle Erinnerungen und Warnungen"
        >
          <SettingRow
            label="Budget-Warnungen"
            description="Benachrichtigung bei Überschreitung"
            value={budgetAlerts}
            onValueChange={setBudgetAlerts}
            disabled={!pushNotifications}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Sparziel-Erinnerungen"
            description="Fortschritt und Meilensteine"
            value={savingsGoalReminders}
            onValueChange={setSavingsGoalReminders}
            disabled={!pushNotifications}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Transaktions-Benachrichtigungen"
            description="Bei jeder neuen Transaktion"
            value={transactionNotifications}
            onValueChange={setTransactionNotifications}
            disabled={!pushNotifications}
          />
        </NotificationSection>

        {/* Calendar Notifications */}
        <NotificationSection
          icon={Calendar}
          title="Kalender"
          subtitle="Termin-Erinnerungen"
        >
          <SettingRow
            label="Termin-Erinnerungen"
            description="Zur eingestellten Zeit"
            value={eventReminders}
            onValueChange={setEventReminders}
            disabled={!pushNotifications}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Tag vorher erinnern"
            description="Zusätzliche Erinnerung am Vortag"
            value={dayBeforeReminder}
            onValueChange={setDayBeforeReminder}
            disabled={!pushNotifications || !eventReminders}
          />
        </NotificationSection>

        {/* Recipe Notifications */}
        <NotificationSection
          icon={ChefHat}
          title="Rezepte"
          subtitle="Koch- und Einkaufs-Erinnerungen"
        >
          <SettingRow
            label="Essensplan-Erinnerungen"
            description="Tägliche Koch-Vorschläge"
            value={mealPlanReminders}
            onValueChange={setMealPlanReminders}
            disabled={!pushNotifications}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Einkaufslisten-Erinnerungen"
            description="Erinnere an offene Artikel"
            value={shoppingListReminders}
            onValueChange={setShoppingListReminders}
            disabled={!pushNotifications}
          />
        </NotificationSection>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Tipp: Du kannst Benachrichtigungen auch in den System-Einstellungen
            deines Geräts verwalten.
          </Text>
        </View>
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
  headerIconContainer: {
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
  section: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sectionTitleText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  sectionHeaderContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  settingsCard: {
    padding: theme.spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  settingRowDisabled: {
    opacity: 0.5,
  },
  settingContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  settingLabelDisabled: {
    color: theme.colors.textTertiary,
  },
  settingDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xs,
  },
  infoBox: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primaryLight + '20',
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
});
