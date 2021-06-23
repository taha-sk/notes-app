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
      if(jsonValue != null){
        const storedNotes: NoteItem[] = JSON.parse(jsonValue);
        setNotes(storedNotes);
      }
    } catch(e) {
      const errorMessage = (e as Error).message
      setErr('Error occured during data initialization. Please restart the application and try again. Error detail: ' + errorMessage);
    }
  };

  const clearAll = async () => {
    if (notes.length > 0) {
      try {
        await AsyncStorage.clear();
      } catch(e) {
        const errorMessage = (e as Error).message
        setErr('Error occured during data removal. Please restart the application and try again. Error detail: ' + errorMessage);
      }
      setNotes(emptyArray);
    }
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
          <AntDesign name="plus" size={30} color="#37667e" />
        </Pressable>
      </View>
      <FlatList 
        data={notes}
        renderItem={({item}) => (
          <Pressable 
          style={({ pressed }) => [ {
            backgroundColor: pressed
              ? '#b8e0f6'
              : '#f0f1f6'
          }, { borderBottomWidth: 1, padding: 5, borderColor: '#7b92aa'}]} 
          onPress={() => navigation.navigate('EditNote', { noteId: item.id})}>
            <Text style={styles.noteItem}>{item.note}</Text>
          </Pressable>
        )}>
      </FlatList>
      {err.length > 0 && <Text>{err}</Text>}
      <View style={styles.footer}>
          <Text>{JSON.stringify(notes.length) + ' Notes'}</Text>
          <Pressable style={({ pressed }) => [ {
            backgroundColor: pressed
              ? '#b8e0f6'
              : '#f0f1f6'
          }, {height: 20}]}  onPress={() => clearAll()}>
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
    height: 50,
    fontSize: 20,
    color: '#37667e'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
