import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, StyleSheet, TextInput, View, Text, Pressable } from 'react-native';
import { NoteItem, RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid'; 

export default function EditNoteScreen({navigation, route} : StackScreenProps<RootStackParamList, 'EditNote'>) {
  
  const { noteId } = route.params;

  const init: NoteItem[] =[];
  const [notes, setNotes] = React.useState(init);

  const [note, setNote] = React.useState('');
  const [err, setErr] = React.useState('');

  const initializeData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@notes');
      if(jsonValue != null){
        const storedNotes: NoteItem[] = JSON.parse(jsonValue);
        setNotes(storedNotes);
        if(noteId.length > 0){
          const storedItem = storedNotes.find(notes => notes.id === noteId);
          if(storedItem){
            setNote(storedItem.note);
          }
        }
      }
    } catch(e) {
      const errorMessage = (e as Error).message
      setErr('Error occured during data initialization. Please restart the application and try again. Error detail: ' + errorMessage);
    }
  };

  const storeData = async (value: NoteItem[]) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@notes', jsonValue)
    } catch (e) {
      const errorMessage = (e as Error).message
      setErr('Error occured during data save. Please restart the application and try again. Error detail: ' + errorMessage);
    }
  };

  const saveNoteAndExit = () => {
    if(note.length > 0){
      if(noteId.length > 0){
        const updatedNotes = notes.map((val) => val.id === noteId ? {id: val.id, note: note} : val);
        storeData(updatedNotes);
      }else{
        const noteItem: NoteItem = { id: uuidv4(), note: note};
        storeData([noteItem, ...notes]);
      }
    }
    navigation.goBack();
  };

  const deleteNote = () => {
    if(noteId.length > 0){
      const updatedNotes = notes.filter((val) => val.id !== noteId);
      storeData(updatedNotes);
    }
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
      {err.length > 0 && <Text>{err}</Text>}
      <View style={styles.footer}>
        <Pressable onPress={() => deleteNote()}>
          <AntDesign name="delete" size={30} color="#dec4d6" />
        </Pressable>        
        <Pressable onPress={() => saveNoteAndExit()}>
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
