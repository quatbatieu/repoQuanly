import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-custom-build/build/ckeditor'
import 'ckeditor5-custom-build/build/translations/vi'
import CustomUploadAdapterPlugin from './FileUpload'

const TextEditor = ({ config, ...props }) => (
  <CKEditor
    editor={Editor}
    config={{
      ...config,
      extraPlugins: [CustomUploadAdapterPlugin],
    }}
    {...props}
  />
)

export default TextEditor
