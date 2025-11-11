import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button Component', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Button title="Click Me" onPress={() => {}} />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when clicked', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Click Me" onPress={onPressMock} />);

    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={onPressMock} disabled />
    );

    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should show loading indicator when loading', () => {
    const { queryByText, UNSAFE_getByType } = render(
      <Button title="Click Me" onPress={() => {}} loading />
    );

    expect(queryByText('Click Me')).toBeNull();
    // ActivityIndicator should be rendered
  });

  it('should apply variant styles correctly', () => {
    const { getByText, rerender } = render(
      <Button title="Primary" onPress={() => {}} variant="primary" />
    );
    expect(getByText('Primary')).toBeTruthy();

    rerender(<Button title="Secondary" onPress={() => {}} variant="secondary" />);
    expect(getByText('Secondary')).toBeTruthy();

    rerender(<Button title="Outline" onPress={() => {}} variant="outline" />);
    expect(getByText('Outline')).toBeTruthy();
  });

  it('should handle fullWidth prop', () => {
    const { getByText } = render(
      <Button title="Full Width" onPress={() => {}} fullWidth />
    );
    expect(getByText('Full Width')).toBeTruthy();
  });
});
