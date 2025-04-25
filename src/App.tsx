import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { SafeAreaView } from 'react-native-safe-area-context'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'

import { RootStackParamList } from './types/types'

import HomeScreen from './screens/HomeScreen'
import QRCodeScanner from './screens/QRCodeScanner'

const Stack = createNativeStackNavigator<RootStackParamList>()

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#17b1ba',
        accent: '#17b1ba',
        background: '#f5f5f5',
        text: '#1e1e1e',
    }
}

export default function App() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PaperProvider theme={theme}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Home">
                        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Scanner" component={QRCodeScanner} options={{ headerShown: false }} />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </SafeAreaView>
    )
}
