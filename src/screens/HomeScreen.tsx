import React, { useEffect, useState } from 'react'
import { StyleSheet, View, PermissionsAndroid } from 'react-native'
import { Appbar, Button } from 'react-native-paper'
import FilePickerManager from 'react-native-file-picker'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { fileData, RootStackParamList } from '../types/types'
import { getLocal } from '../hooks/useStorage'

import WarningDialog from '../components/dialogs/WarningDialog'
import ProgressDialog from '../components/dialogs/ProgressDialog'
import InfoDialog from '../components/dialogs/InfoDialog'

export default function App() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const [progress, setProgress] = useState({
        open: false,
        message: '',
        progress: 0
    })
    const [warning, setWarning] = useState({
        open: false,
        message: ''
    })
    const [info, setInfo] = useState({ open: false })

    const handleClickInfo = () => setInfo({ open: true })

    const handleClickQrCode = () => navigation.navigate('Scanner')

    const handleClickFiles = async () => {
        try {
            const url = await getLocal('url')
            if (!url) return navigation.navigate('Scanner')
            FilePickerManager.showFilePicker({}, (response) => {
                if (response.didCancel) return setWarning({
                    open: true,
                    message: 'Usuário cancelou a seleção'
                })
                if (response.error) return setWarning({
                    open: false,
                    message: `Erro: ${response.error}`
                })
                setProgress({ ...progress, open: true, message: 'Enviando arquivo!' })
                uploadFile(url, response)
                console.log('Arquivo selecionado: ', response)
            })
        } catch (err) {
            console.error(err)
        }
    }

    const uploadFile = async (url: string, { fileName, path, type, uri }: fileData) => {
        try {
            const xhr = new XMLHttpRequest()
            const formData = new FormData()

            const ext = path.split('.').pop()

            formData.append('file', {
                uri: uri,
                type: type || 'application/octet-stream',
                name: `${fileName}.${ext}` || 'arquivo',
            })

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentage = Math.round((event.loaded / (event.total * 2)) * 100)
                    console.log('pregress', percentage)
                    setProgress({ open: true, progress: percentage, message: `Enviando arquivo ${percentage}%` })
                }
            }

            xhr.onload = () => {
                if (xhr.status === 200) {
                    setProgress({ ...progress, open: false })
                    setWarning({ open: true, message: 'Upload concluído com sucesso!' })
                } else {
                    setProgress({ ...progress, open: false })
                    setWarning({ open: true, message: `Erro no upload: ${xhr.status}`, })
                }
            }

            xhr.onerror = () => {
                setProgress({ ...progress, open: false })
                setWarning({ open: true, message: 'Erro de rede, tente novamente!', })
            }

            xhr.open('POST', 'http://192.168.0.196:3003/upload')
            xhr.setRequestHeader('Content-Type', 'multipart/form-data')
            xhr.send(formData)
        } catch (error) {
            setWarning({ open: true, message: 'Erro durante o envio do arquivo' })
        }
    }

    const requestPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Permissão para acessar o armazenamento',
                    message: 'Precisamos acessar seu armazenamento para escolher um arquivo',
                    buttonNeutral: 'Pergunte-me mais tarde',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'OK',
                },
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Permissão de armazenamento concedida')
            } else {
                console.log('Permissão de armazenamento negada')
            }
        } catch (err) {
            console.warn(err)
        }
    }

    const handleCloseProgress = () => setProgress({ ...progress, open: false })

    const handleCloseWarning = () => setWarning({ ...warning, open: false })

    const handleCloseInfo = () => setInfo({ open: false })

    useEffect(() => {
        requestPermission()
    }, [])

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="ZapFile" />
                <Appbar.Action icon="information-outline" onPress={handleClickInfo} />
                <Appbar.Action icon="qrcode-plus" onPress={handleClickQrCode} />
            </Appbar.Header>
            <View style={styles.content}>
                <Button icon='file' mode='contained' onPress={handleClickFiles}>
                    Selecione o arquivo
                </Button>
            </View>
            <ProgressDialog
                open={progress.open}
                message={progress.message}
                progress={progress.progress}
                onClose={handleCloseProgress}
            />
            <WarningDialog
                open={warning.open}
                message={warning.message}
                onClose={handleCloseWarning}
            />
            <InfoDialog
                open={info.open}
                onClose={handleCloseInfo}
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
    }
})
