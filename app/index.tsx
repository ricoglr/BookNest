import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackTab from './Tabs/StackTab';
import { Provider } from 'react-redux';
import { store } from './store'; // Redux store'unuzu import edin
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer independent={true}>
          <StackTab />
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
}
