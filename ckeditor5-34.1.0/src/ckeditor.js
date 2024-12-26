/**
 * @license Copyright (c) 2014-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment.js'
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat.js'
import AutoImage from '@ckeditor/ckeditor5-image/src/autoimage.js'
import AutoLink from '@ckeditor/ckeditor5-link/src/autolink.js'
import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter.js'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js'
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js'
import Image from '@ckeditor/ckeditor5-image/src/image.js'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption.js'
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize.js'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle.js'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar.js'
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js'
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js'
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock.js'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js'
import Link from '@ckeditor/ckeditor5-link/src/link.js'
import LinkImage from '@ckeditor/ckeditor5-link/src/linkimage.js'
import List from '@ckeditor/ckeditor5-list/src/list.js'
import ListProperties from '@ckeditor/ckeditor5-list/src/listproperties.js'
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed.js'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js'
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js'
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat.js'
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough.js'
import Table from '@ckeditor/ckeditor5-table/src/table.js'
import TableCaption from '@ckeditor/ckeditor5-table/src/tablecaption.js'
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties'
import TableColumnResize from '@ckeditor/ckeditor5-table/src/tablecolumnresize.js'
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js'
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline.js'
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount.js'

class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  BlockQuote,
  Bold,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  Strikethrough,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  Underline,
  WordCount,
]

// Editor configuration.
Editor.defaultConfig = {
  toolbar: {
    items: [
      'heading',
      'imageUpload',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'removeFormat',
      '|',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      'alignment',
      '|',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      '|',
      'undo',
      'redo',
    ],
  },
  language: 'en',
  image: {
    toolbar: [
      'imageTextAlternative',
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',
      'toggleImageCaption',
      'linkImage',
    ],
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties',
      'tableProperties',
    ],
  },
}

export default Editor
