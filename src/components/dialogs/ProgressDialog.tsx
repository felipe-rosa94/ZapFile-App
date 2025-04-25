import { StyleSheet } from 'react-native'
import { Dialog, Text, Portal, ProgressBar } from 'react-native-paper'

import { ProgressDialogProps } from '../../types/types'

export default function ProgressDialog({ open, onClose: handleClose, message, progress }: ProgressDialogProps) {

    return (
        <Portal>
            <Dialog visible={open} onDismiss={handleClose}>
                <Dialog.Title>Enviando...</Dialog.Title>
                <Dialog.Content style={styles.content}>
                    <Text>
                        {message}
                    </Text>
                    <ProgressBar
                        progress={progress / 100}                        
                    />
                </Dialog.Content>
            </Dialog>
        </Portal>
    )
}

const styles = StyleSheet.create({
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginBottom: 10
    }
})