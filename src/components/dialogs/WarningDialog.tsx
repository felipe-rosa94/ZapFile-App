import { Dialog, Text, Button, Portal } from 'react-native-paper'

import { WarningDialogProps } from '../../types/types'

export default function WarningDialog({ open, onClose: handleClose, message }: WarningDialogProps) {

    return (
        <Portal>
            <Dialog visible={open} onDismiss={handleClose}>
                <Dialog.Title>Aviso!</Dialog.Title>
                <Dialog.Content>
                    <Text>
                        {message}
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