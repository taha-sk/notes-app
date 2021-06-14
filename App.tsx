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

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Notes">
          <Stack.Screen name="Notes" component={NotesScreen} options={{ headerTitleStyle: { fontSize: 30, fontWeight: 'bold'} }} />
          <Stack.Screen name="EditNote" component={EditNoteScreen} options={{ title: 'Edit Note'}} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar />
    </SafeAreaProvider>
  );
}
