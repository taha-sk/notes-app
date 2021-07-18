import AsyncStorage from "@react-native-async-storage/async-storage";
import { NoteItem } from "./types";
import * as Sentry from 'sentry-expo';
import { config } from "./AppConfig";
import { v4 as uuidv4 } from 'uuid';

export default class NotesStorage {

    protected static storageKey: string = config.notesStorageKey;
  
    static getNotes = async () => {
        let notes: NoteItem[] = [];
        try {
            const jsonValue = await AsyncStorage.getItem(this.storageKey);
            if(jsonValue != null){
                notes = JSON.parse(jsonValue);
            }
        } catch(e) {
            Sentry.Native.captureException(e);
        }
        return notes;
    }

    static saveOrUpdateNote = async (note: NoteItem) => {
        const notes: NoteItem[] = await this.getNotes();
        if(note.id.length > 0){
            this.storeData(notes.map((val) => val.id === note.id ? note : val));
        }else{
            note.id = uuidv4();
            this.storeData([note, ...notes]);
        }
        return notes;
    }

    static deleteNote = async (noteId: string) => {
        if(noteId.length > 0){
            const notes: NoteItem[] = await this.getNotes();
            this.storeData(notes.filter((val) => val.id !== noteId));
        }
    }

    static clearNotes = async () => {
        try {
            await AsyncStorage.removeItem(this.storageKey);
        } catch(e) {
            Sentry.Native.captureException(e);
        }
    }    
        
    private static storeData = async (value: NoteItem[]) => {
        try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem(this.storageKey, jsonValue)
        } catch (e) {
          Sentry.Native.captureException(e);
        }
    };

  }