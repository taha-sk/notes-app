import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, StyleSheet, TextInput, View, Pressable } from 'react-native';
import { NoteItem, RootStackParamList } from '../types';
import { AntDesign } from '@expo/vector-icons';
import NotesStorage from '../NotesStorage';

export default function EditNoteScreen({navigation, route} : StackScreenProps<RootStackParamList, 'EditNote'>) {
  
  const { noteId } = route.params;

  const [note, setNote] = React.useState('');

  const initializeData = async () => {
    const storedNotes: NoteItem[] = await NotesStorage.getNotes();
    if(noteId.length > 0){
      const storedItem = storedNotes.find(notes => notes.id === noteId);
      if(storedItem){
        setNote(storedItem.note);
      }
    }
  };

  const saveOrUpdateNoteAndExit =  async () => {
    if(note.length > 0){
      await NotesStorage.saveOrUpdateNote({ id: noteId, note: note} as NoteItem);
    }
    navigation.goBack();
  };

  const deleteNote = async () => {
    await NotesStorage.deleteNote(noteId);
    navigation.goBack();
  };

  React.useEffect(() => {initializeData()}, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <TextInput
          style={{height: 275, fontSize: 20}}
          multiline
          placeholder="Type here to add your note!"
          onChangeText={text => setNote(text)}
          defaultValue={note}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Pressable testID="delete-btn" onPress={() => deleteNote()}>
          <AntDesign name="delete" size={30} color="#dec4d6" />
        </Pressable>        
        <Pressable testID="save-btn" onPress={() => saveOrUpdateNoteAndExit()}>
          <AntDesign name="save" size={30} color="#37667e" />
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
});
