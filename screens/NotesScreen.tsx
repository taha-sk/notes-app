import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { NoteItem, RootStackParamList } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotesScreen({navigation} : StackScreenProps<RootStackParamList, 'Notes'>) {
  
  const init: NoteItem[] =[];
  const [notes, setNotes] = React.useState(init);
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
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }
  
    console.log('Done.')
  };

  React.useEffect(() => {initializeData()}, []);

  return (
    <View style={styles.container}>
      <View style={styles.addNoteSign}>
        <Pressable onPress={() => navigation.navigate('EditNote', { noteId: ''})}>
          <AntDesign name="plus" size={24} color="black" />
        </Pressable>
      </View>
      <FlatList 
        data={notes}
        renderItem={({item}) => <Text>{item.note}</Text>}>
      </FlatList>
      <View>
          <Text>{JSON.stringify(notes.length) + ' Notes'}</Text>
          {err.length > 0 && <Text>{err}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  addNoteSign: {
    flexDirection: "row-reverse"
  }
});
