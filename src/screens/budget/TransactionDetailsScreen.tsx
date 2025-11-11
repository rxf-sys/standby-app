import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Calendar,
  Tag,
  FileText,
  Trash2,
  Edit3,
  TrendingUp,
  TrendingDown,
} from 'lucide-react-native';
import { BudgetStackParamList } from '@/navigation/types';
import { Card, LoadingScreen, Button, Badge } from '@/components/common';
import { useTransaction, useDeleteTransaction } from '@/hooks/useBudget';
import { formatCurrency } from '@/utils/currency';
import { theme } from '@/theme';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

type Props = NativeStackScreenProps<BudgetStackParamList, 'TransactionDetails'>;

const CATEGORY_LABELS: Record<string, string> = {
  food: 'Lebensmittel',
  transport: 'Transport',
  entertainment: 'Unterhaltung',
  housing: 'Wohnen',
  health: 'Gesundheit',
  education: 'Bildung',
  shopping: 'Shopping',
  other: 'Sonstiges',
  salary: 'Gehalt',
  freelance: 'Freelance',
  investment: 'Investition',
  gift: 'Geschenk',
};

export const TransactionDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { transactionId } = route.params;
  const { data: transaction, isLoading } = useTransaction(transactionId);
  const deleteTransactionMutation = useDeleteTransaction();

  const handleDelete = () => {
    Alert.alert(
      'Transaktion löschen',
      'Möchtest du diese Transaktion wirklich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => {
            deleteTransactionMutation.mutate(transactionId, {
              onSuccess: () => {
                navigation.goBack();
              },
              onError: () => {
                Alert.alert('Fehler', 'Transaktion konnte nicht gelöscht werden');
              },
            });
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    Alert.alert('Info', 'Bearbeitungsfunktion kommt bald');
  };

  if (isLoading || !transaction) {
    return <LoadingScreen />;
  }

  const isIncome = transaction.type === 'income';
  const categoryLabel = CATEGORY_LABELS[transaction.category] || transaction.category;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Amount Card */}
        <Card style={styles.amountCard}>
          <View style={styles.amountHeader}>
            {isIncome ? (
              <TrendingUp color={theme.colors.success} size={32} />
            ) : (
              <TrendingDown color={theme.colors.error} size={32} />
            )}
          </View>
          <Text
            style={[
              styles.amount,
              isIncome ? styles.amountIncome : styles.amountExpense,
            ]}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </Text>
          <Text style={styles.title}>{transaction.title}</Text>
          {transaction.description && (
            <Text style={styles.description}>{transaction.description}</Text>
          )}
        </Card>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>

          <Card style={styles.detailCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Calendar color={theme.colors.textSecondary} size={20} />
                <Text style={styles.detailLabel}>Datum</Text>
              </View>
              <Text style={styles.detailValue}>
                {format(new Date(transaction.date), 'dd. MMMM yyyy', { locale: de })}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Tag color={theme.colors.textSecondary} size={20} />
                <Text style={styles.detailLabel}>Kategorie</Text>
              </View>
              <Badge
                text={categoryLabel}
                variant={isIncome ? 'success' : 'error'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <FileText color={theme.colors.textSecondary} size={20} />
                <Text style={styles.detailLabel}>Typ</Text>
              </View>
              <Text style={styles.detailValue}>
                {isIncome ? 'Einnahme' : 'Ausgabe'}
              </Text>
            </View>
          </Card>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Button
            title="Bearbeiten"
            onPress={handleEdit}
            variant="outline"
            icon={<Edit3 color={theme.colors.primary} size={20} />}
            fullWidth
          />
          <Button
            title="Löschen"
            onPress={handleDelete}
            variant="outline"
            icon={<Trash2 color={theme.colors.error} size={20} />}
            fullWidth
            style={styles.deleteButton}
          />
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
  amountCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  amountHeader: {
    marginBottom: theme.spacing.md,
  },
  amount: {
    fontSize: 48,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  },
  amountIncome: {
    color: theme.colors.success,
  },
  amountExpense: {
    color: theme.colors.error,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
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
  detailCard: {
    padding: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xs,
  },
  actionsSection: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xl,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
});
