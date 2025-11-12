import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Palette, Sun, Moon, Smartphone } from 'lucide-react-native';
import { RootStackParamList } from '@/navigation/types';
import { Card } from '@/components/common';
import { useTheme } from '@/hooks/useTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'ThemeSettings'>;

type ThemeMode = 'light' | 'dark' | 'system';

export const ThemeSettingsScreen: React.FC<Props> = () => {
  const { theme, setThemeMode, setUseDynamicColors } = useTheme();
  const selectedTheme = theme.themeMode;
  const useDynamicColors = theme.useDynamicColors;

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
    sectionTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: theme.spacing.sm,
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
      paddingVertical: theme.spacing.md,
    },
    optionCardActive: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    iconContainerActive: {
      backgroundColor: theme.colors.primaryLight + '20',
      borderColor: theme.colors.primary,
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    optionTitleActive: {
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    optionSubtitle: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    radioOuter: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioOuterActive: {
      borderColor: theme.colors.primary,
    },
    radioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.primary,
    },
    settingCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    settingContent: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    settingTitle: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    settingSubtitle: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    previewCard: {
      padding: theme.spacing.lg,
    },
    previewTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    previewText: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
      lineHeight: 22,
    },
    previewActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    previewButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
    },
    previewButtonText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.textInverse,
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

  const ThemeOption = ({
    icon: Icon,
    title,
    subtitle,
    mode,
  }: {
    icon: typeof Sun;
    title: string;
    subtitle: string;
    mode: ThemeMode;
  }) => (
    <TouchableOpacity
      onPress={() => setThemeMode(mode)}
      activeOpacity={0.7}
    >
      <Card
        style={StyleSheet.flatten([
          styles.optionCard,
          selectedTheme === mode ? styles.optionCardActive : undefined,
        ])}
      >
        <View style={styles.optionLeft}>
          <View
            style={[
              styles.iconContainer,
              selectedTheme === mode ? styles.iconContainerActive : undefined,
            ]}
          >
            <Icon
              color={
                selectedTheme === mode
                  ? theme.colors.primary
                  : theme.colors.textSecondary
              }
              size={24}
            />
          </View>
          <View style={styles.optionContent}>
            <Text
              style={[
                styles.optionTitle,
                selectedTheme === mode ? styles.optionTitleActive : undefined,
              ]}
            >
              {title}
            </Text>
            <Text style={styles.optionSubtitle}>{subtitle}</Text>
          </View>
        </View>
        <View
          style={[
            styles.radioOuter,
            selectedTheme === mode ? styles.radioOuterActive : undefined,
          ]}
        >
          {selectedTheme === mode && <View style={styles.radioInner} />}
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Palette color={theme.colors.primary} size={32} />
          </View>
          <Text style={styles.headerTitle}>Aussehen</Text>
          <Text style={styles.headerSubtitle}>
            Passe das Design der App nach deinen Vorlieben an
          </Text>
        </View>

        {/* Theme Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme-Modus</Text>

          <ThemeOption
            icon={Sun}
            title="Hell"
            subtitle="Helles Farbschema"
            mode="light"
          />

          <ThemeOption
            icon={Moon}
            title="Dunkel"
            subtitle="Dunkles Farbschema"
            mode="dark"
          />

          <ThemeOption
            icon={Smartphone}
            title="System"
            subtitle="Folgt den Systemeinstellungen"
            mode="system"
          />
        </View>

        {/* Additional Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weitere Optionen</Text>

          <Card style={styles.settingCard}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Dynamische Farben</Text>
              <Text style={styles.settingSubtitle}>
                Nutze Farben aus deinem Hintergrundbild (Android 12+)
              </Text>
            </View>
            <Switch
              value={useDynamicColors}
              onValueChange={setUseDynamicColors}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.surface}
            />
          </Card>
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vorschau</Text>
          <Card style={styles.previewCard}>
            <Text style={styles.previewTitle}>Beispiel Karte</Text>
            <Text style={styles.previewText}>
              So werden Inhalte in der App angezeigt
            </Text>
            <View style={styles.previewActions}>
              <View style={styles.previewButton}>
                <Text style={styles.previewButtonText}>Aktion</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Tipp: Wähle &quot;System&quot;, um automatisch zwischen hellem und dunklem Theme zu wechseln, basierend auf deinen Systemeinstellungen.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
