import React from 'react';

import {Alert, View} from 'react-native';

function renderAlert(message, hideSelf) {
  Alert.alert('Error', message, [{text: 'OK', onPress: () => hideSelf()}], {
    cancelable: false,
  });
}

export default function ErrorAlert({message, hideSelf}) {
  return <View>{renderAlert(message, hideSelf)}</View>;
}
