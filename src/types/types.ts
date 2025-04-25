export type WarningDialogProps = {
    open: boolean,
    onClose: () => void,
    message: string
}

export type ProgressDialogProps = {
    open: boolean,
    onClose: () => void,
    message: string,
    progress: number
}

export type RootStackParamList = {
    Home: undefined
    Scanner: undefined
}

export type fileData = {
    fileName: string,
    path: string,
    type: string,
    uri: string
}

export type InfoDialogProps = {
    open: boolean,
    onClose: () => void
}