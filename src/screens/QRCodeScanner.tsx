import React, { useEffect, useState } from 'react'
import { Appbar } from 'react-native-paper'
import { View, StyleSheet, PermissionsAndroid, Platform } from 'react-native'
import { Camera } from 'react-native-camera-kit'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { RootStackParamList } from '../types/types'
import { setLocal } from '../hooks/useStorage'

import WarningDialog from '../components/dialogs/WarningDialog'

const QRCodeScanner = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const [isScanning, setIsScanning] = useState(false)
    const [warning, setWarning] = useState({
        open: false,
        message: ''
    })

    const handleClickBack = () => navigation.goBack()

    const handleRead = (value: string) => {
        if (!value.startsWith('http://')) return setWarning({
            open: false,
            message: 'Qr Code inválido'
        })
        setLocal('url', value)
        navigation.navigate('Home')
    }

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Permissão para usar a câmera',
                    message: 'O aplicativo precisa de acesso à câmera para escanear QR Codes.',
                    buttonNeutral: 'Perguntar depois',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'OK',
                }
            )
            return granted === PermissionsAndroid.RESULTS.GRANTED
        }
        return true
    }

    const handleCloseWarning = () => setWarning({ ...warning, open: false })

    const startScanner = async () => {
        const hasPermission = await requestCameraPermission()
        if (hasPermission) {
            setIsScanning(true)
        } else {
            console.log('Permissão de câmera não concedida.')
        }
    }

    useEffect(() => {
        startScanner()
    }, [])

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={handleClickBack} />
                <Appbar.Content title="Qr Code" />
            </Appbar.Header>
            <View style={styles.content}>
                {isScanning && <Camera
                    style={styles.camera}
                    showFrame={true}
                    scanBarcode={true}
                    laserColor="blue"
                    frameColor="green"
                    onReadCode={(event) => {
                        handleRead(event.nativeEvent.codeStringValue)
                        setIsScanning(false)
                    }}
                />}
            </View>
            <WarningDialog
                open={warning.open}
                message={warning.message}
                onClose={handleCloseWarning}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1
    },
    content: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    camera: {
        width: 200,
        height: 200
    }
})

export default QRCodeScanner
