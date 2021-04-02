import React from 'react';
import {Button, TouchableHighlight} from 'react-native';

export default function FooterButton({title, onPress}) {
  return (
    <TouchableHighlight
      style={{
        height: 40,
        width: 160,
        borderRadius: 10,
        backgroundColor: '#88d6ae',
      }}>
      <Button onPress={onPress} title={title} />
    </TouchableHighlight>
  );
}
