import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { NoteItem, RootStackParamList } from '../types';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotesScreen({navigation} : StackScreenProps<RootStackParamList, 'Notes'>) {
  
  const emptyArray: NoteItem[] =[];
  const [notes, setNotes] = React.useState(emptyArray);
  const [err, setErr] = React.useState('');

  const initializeData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@notes');
      console.log(jsonValue);
      if(jsonValue != null){
        const storedNotes: NoteItem[] = JSON.parse(jsonValue);
        setNotes(storedNotes);
      }
    } catch(e) {
      const errorMessage = (e as Error).message
      setErr('Error occured during data initialization: ' + errorMessage);
    }
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch(e) {
      const errorMessage = (e as Error).message
      setErr('Error occured during data removal: ' + errorMessage);
    }
    setNotes(emptyArray);
  };

  React.useEffect(() => {
    return navigation.addListener('focus', () => {
      initializeData();
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.addNoteSign}>
        <Pressable onPress={() => navigation.navigate('EditNote', { noteId: ''})}>
          <AntDesign name="plus" size={24} color="#37667e" />
        </Pressable>
      </View>
      <FlatList 
        data={notes}
        renderItem={({item}) => (
          <Pressable style={styles.noteItem} onPress={() => navigation.navigate('EditNote', { noteId: item.id})}>
            <Text>{item.note}</Text>
          </Pressable>
        )}>
      </FlatList>
      {err.length > 0 && <Text>{err}</Text>}
      <View style={styles.footer}>
          <Text>{JSON.stringify(notes.length) + ' Notes'}</Text>
          <Pressable onPress={() => clearAll()}>
            <Text>Clear All</Text>
          </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f1f6',
    padding: 20
  },
  addNoteSign: {
    flexDirection: "row-reverse"
  },
  noteItem: {
    height: 20
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
