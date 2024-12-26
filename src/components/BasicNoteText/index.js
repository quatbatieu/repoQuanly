import { Typography } from 'antd'

const BasicNoteText = ({ value, width, row, expandable, symbol}) => {
    // expandable : true hoặc false
    // symbol : text sau dấu '...'
  return (
    <Typography.Paragraph
            className="sms-content"
            style={{ width: width }}
            ellipsis={{
              rows: row,
              expandable: expandable,
              symbol: symbol
            }}
          >
            {value}
          </Typography.Paragraph>
  )
}

export default BasicNoteText