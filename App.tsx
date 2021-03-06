import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import NotesScreen from './screens/NotesScreen';
import EditNoteScreen from './screens/EditNoteScreen';
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: '<dsn>',
  enableInExpoDevelopment: true,
  debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
});

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Notes">
          <Stack.Screen name="Notes" component={NotesScreen} options={{ headerStyle: { backgroundColor: '#a4cce3' }, headerTintColor: '#37667e', headerTitleStyle: { fontSize: 30, fontWeight: 'bold'} }} />
          <Stack.Screen name="EditNote" component={EditNoteScreen} options={{ title: 'Note', headerStyle: { backgroundColor: '#a4cce3' }, headerTintColor: '#37667e'}} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar />
    </SafeAreaProvider>
  );
}
