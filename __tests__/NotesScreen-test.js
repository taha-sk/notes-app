import * as React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';

import NotesScreen from '../screens/NotesScreen';

describe('<NotesScreen />', () => {

  it('renders correctly', () => {
    const navigation = { addListener: jest.fn(), navigate: jest.fn()};
    const tree = renderer.create(<NotesScreen navigation={navigation}/>).toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it('has 3 child', () => {
    const navigation = { addListener: jest.fn(), navigate: jest.fn()};
    const tree = renderer.create(<NotesScreen navigation={navigation}/>).toJSON();
    expect(tree.children.length).toBe(3);
  });  

  it('initializes correctly', () => {
    const navigation = { addListener: jest.fn(), navigate: jest.fn()};
    const { getByText } = render(<NotesScreen navigation={navigation} />);
    const numberOfNotes = getByText('0 Notes');
    expect(numberOfNotes).toBeTruthy();
  });
  
  it('add button navigates correctly', () => {
    const navigation = { addListener: jest.fn(), navigate: jest.fn()};
    const { getByTestId } = render(<NotesScreen navigation={navigation} />);
    const addBtn = getByTestId('add-btn');
    fireEvent.press(addBtn);
    expect(navigation.navigate).toHaveBeenCalledWith('EditNote', { noteId: ''});
  });

});
 