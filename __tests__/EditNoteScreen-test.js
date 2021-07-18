import * as React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import EditNoteScreen from '../screens/EditNoteScreen';

describe('<EditNoteScreen />', () => {

  it('renders correctly', () => {
    const EditNoteScreenProps = {
      navigation: {goBack: jest.fn()},
      route: {params: { noteId: "1"}}
    };
    const tree = renderer.create(<EditNoteScreen {...EditNoteScreenProps}/>).toJSON();
    expect(tree).toMatchSnapshot();
  });  

  it('has 2 child', () => {
    const EditNoteScreenProps = {
      navigation: {goBack: jest.fn()},
      route: {params: { noteId: "1"}}
    };
    const tree = renderer.create(<EditNoteScreen {...EditNoteScreenProps}/>).toJSON();
    expect(tree.children.length).toBe(2);
  });

  it('saves correctly', async () => {
    const EditNoteScreenProps = {
      navigation: {goBack: jest.fn()},
      route: {params: { noteId: "1"}}
    };
    const { getByPlaceholderText, getByTestId } = render(<EditNoteScreen {...EditNoteScreenProps} />);
    fireEvent.changeText(
      getByPlaceholderText('Type here to add your note!'),
      'test note'
    );
    const saveBtn = getByTestId('save-btn');
    fireEvent.press(saveBtn);
    await waitFor(() => expect(EditNoteScreenProps.navigation.goBack).toHaveBeenCalled());
  });

  it('deletes correctly', async () => {
    const EditNoteScreenProps = {
      navigation: {goBack: jest.fn()},
      route: {params: { noteId: "1"}}
    };
    const { getByTestId } = render(<EditNoteScreen {...EditNoteScreenProps} />);
    const deleteBtn = getByTestId('delete-btn');
    fireEvent.press(deleteBtn);
    await waitFor(() => expect(EditNoteScreenProps.navigation.goBack).toHaveBeenCalled());
  });  

});
