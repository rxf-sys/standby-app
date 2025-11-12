import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronDown, ChevronUp, HelpCircle, Mail, Book } from 'lucide-react-native';
import { RootStackParamList } from '@/navigation/types';
import { Card } from '@/components/common';
import { useTheme } from '@/hooks/useTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpFAQ'>;

interface FAQItem {
  question: string;
  answer: string;
  category: 'budget' | 'recipes' | 'calendar' | 'account' | 'general';
}

const faqData: FAQItem[] = [
  {
    question: 'Wie füge ich eine Transaktion hinzu?',
    answer: 'Gehe zum Budget-Tab und tippe auf den "+ Einnahme" oder "+ Ausgabe" Button. Fülle die Details aus und speichere die Transaktion.',
    category: 'budget',
  },
  {
    question: 'Kann ich meine Transaktionen bearbeiten?',
    answer: 'Ja! Tippe auf eine Transaktion in der Übersicht, um die Details zu sehen. Dort findest du einen "Bearbeiten" Button.',
    category: 'budget',
  },
  {
    question: 'Wie funktionieren Sparziele?',
    answer: 'Sparziele helfen dir, für bestimmte Dinge zu sparen. Erstelle ein Ziel mit einem Namen, Zielbetrag und Datum. Die App zeigt dir deinen Fortschritt an.',
    category: 'budget',
  },
  {
    question: 'Wie kann ich Rezepte als Favoriten markieren?',
    answer: 'Öffne ein Rezept und tippe auf das Herz-Symbol oben rechts. Alle Favoriten findest du dann im Rezepte-Tab.',
    category: 'recipes',
  },
  {
    question: 'Was ist die Einkaufsliste?',
    answer: 'Die Einkaufsliste sammelt alle Zutaten, die du zum Kochen brauchst. Du kannst Zutaten aus Rezepten hinzufügen oder eigene Einträge erstellen.',
    category: 'recipes',
  },
  {
    question: 'Wie erstelle ich einen Kalendereintrag?',
    answer: 'Gehe zum Kalender-Tab und tippe auf das "+" Symbol. Wähle Datum, Uhrzeit und Kategorie aus und speichere den Termin.',
    category: 'calendar',
  },
  {
    question: 'Kann ich Erinnerungen für Termine setzen?',
    answer: 'Ja! Beim Erstellen oder Bearbeiten eines Termins kannst du eine Erinnerungszeit festlegen. Du wirst dann benachrichtigt.',
    category: 'calendar',
  },
  {
    question: 'Wie ändere ich mein Profilbild?',
    answer: 'Gehe zu Einstellungen → Profil bearbeiten und tippe auf "Foto ändern". Wähle ein Foto aus der Galerie oder mache ein neues Foto.',
    category: 'account',
  },
  {
    question: 'Wie ändere ich das Theme (Hell/Dunkel)?',
    answer: 'Gehe zu Einstellungen → Aussehen und wähle zwischen Hell, Dunkel oder System-Theme. Das System-Theme passt sich automatisch an deine Geräteeinstellungen an.',
    category: 'general',
  },
  {
    question: 'Sind meine Daten sicher?',
    answer: 'Ja! Alle Daten werden verschlüsselt auf EU-Servern gespeichert. Die App ist DSGVO-konform und deine Privatsphäre hat höchste Priorität.',
    category: 'account',
  },
  {
    question: 'Funktioniert die App offline?',
    answer: 'Viele Funktionen funktionieren offline. Deine Daten werden lokal gespeichert und synchronisiert, sobald du wieder online bist.',
    category: 'general',
  },
  {
    question: 'Wie kann ich mein Passwort zurücksetzen?',
    answer: 'Auf dem Login-Screen gibt es einen "Passwort vergessen?" Link. Folge den Anweisungen, um dein Passwort zurückzusetzen.',
    category: 'account',
  },
];

const categories = [
  { key: 'all', label: 'Alle', icon: Book },
  { key: 'budget', label: 'Budget', icon: HelpCircle },
  { key: 'recipes', label: 'Rezepte', icon: HelpCircle },
  { key: 'calendar', label: 'Kalender', icon: HelpCircle },
  { key: 'account', label: 'Account', icon: HelpCircle },
  { key: 'general', label: 'Allgemein', icon: HelpCircle },
] as const;

export const HelpFAQScreen: React.FC<Props> = () => {
  const { theme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
    categoryContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    categoryScroll: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    categoryButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    categoryButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryButtonText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
    },
    categoryButtonTextActive: {
      color: theme.colors.textInverse,
    },
    faqContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    faqItem: {
      marginBottom: theme.spacing.sm,
    },
    questionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    questionText: {
      flex: 1,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
    },
    answerContainer: {
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    answerText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    contactSection: {
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.xl,
      marginTop: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    contactCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
    },
    contactIconContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primaryLight + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    contactContent: {
      flex: 1,
    },
    contactTitle: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    contactText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
  });

  const filteredFAQs =
    selectedCategory === 'all'
      ? faqData
      : faqData.filter((faq) => faq.category === selectedCategory);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <HelpCircle color={theme.colors.primary} size={32} />
          </View>
          <Text style={styles.headerTitle}>Hilfe & FAQ</Text>
          <Text style={styles.headerSubtitle}>
            Finde Antworten auf häufig gestellte Fragen
          </Text>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.key && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category.key && styles.categoryButtonTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FAQ List */}
        <View style={styles.faqContainer}>
          {filteredFAQs.map((faq, index) => (
            <Card key={index} style={styles.faqItem}>
              <TouchableOpacity onPress={() => toggleExpand(index)} activeOpacity={0.7}>
                <View style={styles.questionContainer}>
                  <Text style={styles.questionText}>{faq.question}</Text>
                  {expandedIndex === index ? (
                    <ChevronUp color={theme.colors.primary} size={20} />
                  ) : (
                    <ChevronDown color={theme.colors.textSecondary} size={20} />
                  )}
                </View>
                {expandedIndex === index && (
                  <View style={styles.answerContainer}>
                    <Text style={styles.answerText}>{faq.answer}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Brauchst du weitere Hilfe?</Text>
          <Card style={styles.contactCard}>
            <View style={styles.contactIconContainer}>
              <Mail color={theme.colors.primary} size={24} />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Kontaktiere uns</Text>
              <Text style={styles.contactText}>kontakt@standby-app.de</Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};
