import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { AuthScreen } from '@/screens/auth/AuthScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { ProfileEditScreen } from '@/screens/settings/ProfileEditScreen';
import { ChangePasswordScreen } from '@/screens/settings/ChangePasswordScreen';
import { ThemeSettingsScreen } from '@/screens/settings/ThemeSettingsScreen';
import { NotificationSettingsScreen } from '@/screens/settings/NotificationSettingsScreen';
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
            <Stack.Screen
              name="ProfileEdit"
              component={ProfileEditScreen}
              options={{
                headerShown: true,
                title: 'Profil bearbeiten',
              }}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
              options={{
                headerShown: true,
                title: 'Passwort ändern',
              }}
            />
            <Stack.Screen
              name="ThemeSettings"
              component={ThemeSettingsScreen}
              options={{
                headerShown: true,
                title: 'Aussehen',
              }}
            />
            <Stack.Screen
              name="NotificationSettings"
              component={NotificationSettingsScreen}
              options={{
                headerShown: true,
                title: 'Benachrichtigungen',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
