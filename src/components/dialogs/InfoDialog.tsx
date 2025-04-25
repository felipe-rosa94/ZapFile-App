import { useEffect, useState } from 'react'
import { Dialog, Text, Button, Portal } from 'react-native-paper'

import { InfoDialogProps } from '../../types/types'
import { getHostname, getIp } from '../../utils/Helpers'
import { getLocal } from '../../hooks/useStorage'

export default function InfoDialog({ open, onClose: handleClose }: InfoDialogProps) {
    const [ip, setIp] = useState('')
    const [hostname, setHostname] = useState('')
    const [url, setUrl] = useState('')

    const checkNetwork = async () => {
        const ip = await getIp()
        setIp(ip)
        const hostname = await getHostname()
        setHostname(hostname)
        const url = await getLocal('url')
        setUrl(url)
    }

    useEffect(() => {
        checkNetwork()
    }, [])

    return (
        <Portal>
            <Dialog visible={open} onDismiss={handleClose}>
                <Dialog.Title>Informações</Dialog.Title>
                <Dialog.Content>
                    <Text>
                        {`IP: ${ip}`}
                    </Text>
                    <Text>
                        {`Rede: ${hostname}`}
                    </Text>
                    <Text>
                        {`URL: ${url}`}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={handleClose}>
                        Ok
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}