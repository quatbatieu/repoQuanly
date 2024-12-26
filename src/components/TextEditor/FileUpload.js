import { notification } from 'antd'
import i18next from 'i18next'
import uploadService from '../../services/uploadService'
import { convertFileToBase64 } from '../../helper/common'
class CustomFileUploadAdapter {
  constructor(loader, messages) {
    // The file loader instance to use during the upload.
    this.loader = loader

    this.messages = messages
  }

  // Starts the upload process.
  upload() {
    // Return a promise that will be resolved when the file is uploaded.
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          convertFileToBase64(file).then((dataUrl) => {
            const newData = dataUrl.replace(/,/gi, '').split('base64')
            if (newData[1]) {
              uploadService
                .uploadImage({
                  imageData: newData[1],
                  imageFormat: 'png',
                })
                .then((result) => {
                  if (result.issSuccess) {
                    this.loader.uploaded = true
                    return resolve({
                      default: result.data,
                    })
                  } else {
                    notification['error']({
                      message: '',
                      description:
                        result.statusCode === 413
                          ? i18next.t('new.imageTooLarge')
                          : i18next.t('new.saveImageFailed'),
                    })
                    return reject()
                  }
                })
            } else {
              notification['error']({
                message: '',
                description: i18next.t('new.wrongImageFile'),
              })

              return reject()
            }
          })
        })
    )
  }

  // // Aborts the upload process.
  // abort() {
  //   // Reject the promise returned from the upload() method.
  //   server.abortUpload()
  // }
}

export default function FileUpload(editor) {
  // const { t: translation } = useTranslation()
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    // Configure the URL to the upload script in your back-end here!
    return new CustomFileUploadAdapter(loader)
  }
}
