export const sendFileDataToReactNative = (blob, nameFile) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64Data = reader.result.split(',')[1];
            const message = JSON.stringify({
                type: 'download',
                fileName: nameFile,
                data: base64Data,
            });
            window.ReactNativeWebView.postMessage(message);
        };
        reader.readAsDataURL(blob);
};

//Function kiem tra neu đang ở webview
export const isWebview = () => {
    return !!window.ReactNativeWebView;
}