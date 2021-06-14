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
      setErr('Error occured during data initialization: ' + errorMessage);
    }
  };

  const storeData = async (value: NoteItem[]) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@notes', jsonValue)
    } catch (e) {
      const errorMessage = (e as Error).message
      setErr('Error occured during data save: ' + errorMessage);
    }
  };

  const saveAndExit = () => {
    if(noteId.length > 0){
      const updatedNotes = notes.map((val) => val.id === noteId ? {id: val.id, note: note} : val)
      storeData(updatedNotes);
    }else{
      const noteItem: NoteItem = { id: uuidv4(), note: note};
      storeData([...notes, noteItem]);
    }
    navigation.goBack();
  };

  React.useEffect(() => {initializeData()}, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <TextInput
          style={{height: 40}}
          placeholder="Type here to add your note!"
          onChangeText={text => setNote(text)}
          defaultValue={note}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Pressable onPress={() => navigation.navigate('EditNote', { noteId: ''})}>
          <AntDesign name="delete" size={24} color="black" />
        </Pressable>        
        <Pressable onPress={() => saveAndExit()}>
          <AntDesign name="save" size={24} color="black" />
        </Pressable>
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
});
