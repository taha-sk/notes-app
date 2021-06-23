import * as React from 'react';
import renderer from 'react-test-renderer';

import NotesScreen from '../screens/NotesScreen';

describe('<NotesScreen />', () => {

  it('renders correctly', () => {
    const tree = renderer.create(<NotesScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });  

});
