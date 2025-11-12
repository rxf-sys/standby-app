import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ShoppingCart, Trash2, Check, Plus } from 'lucide-react-native';
import { RecipesStackParamList } from '@/navigation/types';
import { Card, EmptyState, LoadingScreen } from '@/components/common';
import { useShoppingList, useUpdateShoppingListItem, useDeleteShoppingListItem } from '@/hooks/useRecipes';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/theme';
import { ShoppingListItem } from '@/types';

type Props = NativeStackScreenProps<RecipesStackParamList, 'ShoppingList'>;

export const ShoppingListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const { data: items, isLoading } = useShoppingList(user?.id || '');
  const updateItem = useUpdateShoppingListItem();
  const deleteItem = useDeleteShoppingListItem();

  const handleToggleCheck = async (item: ShoppingListItem) => {
    try {
      await updateItem.mutateAsync({
        id: item.id,
        updates: { checked: !item.checked },
      });
    } catch (error) {
      Alert.alert('Fehler', 'Item konnte nicht aktualisiert werden');
    }
  };

  const handleDelete = (item: ShoppingListItem) => {
    Alert.alert('Löschen', `"${item.name}" von der Einkaufsliste entfernen?`, [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteItem.mutateAsync(item.id);
          } catch (error) {
            Alert.alert('Fehler', 'Item konnte nicht gelöscht werden');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: ShoppingListItem }) => (
    <Card style={styles.itemCard}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => handleToggleCheck(item)}
        activeOpacity={0.7}
      >
        <View style={styles.checkboxContainer}>
          <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
            {item.checked && <Check color={theme.colors.textInverse} size={16} />}
          </View>
        </View>
        <View style={styles.itemDetails}>
          <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
            {item.name}
          </Text>
          <Text style={styles.itemAmount}>
            {item.amount} {item.unit}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item)}
      >
        <Trash2 color={theme.colors.error} size={20} />
      </TouchableOpacity>
    </Card>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  const uncheckedItems = items?.filter((item) => !item.checked) || [];
  const checkedItems = items?.filter((item) => item.checked) || [];

  return (
    <View style={styles.container}>
      {!items || items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Einkaufsliste ist leer"
          message="Füge Zutaten aus Rezepten hinzu oder erstelle eigene Einträge."
        />
      ) : (
        <FlatList
          data={[...uncheckedItems, ...checkedItems]}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerText}>
                {uncheckedItems.length} offene {uncheckedItems.length === 1 ? 'Artikel' : 'Artikel'}
              </Text>
              {checkedItems.length > 0 && (
                <Text style={styles.headerSubtext}>
                  {checkedItems.length} abgehakt
                </Text>
              )}
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddShoppingListItem')}
        activeOpacity={0.8}
      >
        <Plus color={theme.colors.textInverse} size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  headerText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  headerSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: theme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: theme.colors.textTertiary,
  },
  itemAmount: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  deleteButton: {
    padding: theme.spacing.sm,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
