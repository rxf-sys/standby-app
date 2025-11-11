import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { AuthScreen } from '@/screens/auth/AuthScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/common';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                headerShown: true,
                title: 'Einstellungen',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
