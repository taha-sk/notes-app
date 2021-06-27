import * as React from 'react';
import renderer from 'react-test-renderer';

// Mock before file import
jest.mock('sentry-expo', () => ({
  init: jest.fn()
}));

import App from '../App.tsx';

describe('<App />', () => {

  it('renders correctly', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });  

});
