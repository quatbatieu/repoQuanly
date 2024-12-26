import React, { useState, useEffect } from 'react'
import { Modal, Input, Form } from 'antd'
import MessageService from '../../services/messageService'
import { useTranslation } from 'react-i18next'

const UpdateMessageModal = (props) => {
  const { closeModal, args, fetchMessage } = props
  const { t: translation } = useTranslation();
  // replace customerMessage passing as props by useEffect call getById
  const [message, setMessage] = useState({})

  useEffect(() => {
    MessageService.getMessageById(args.messageCustomerId).then((result) => {
      setMessage(result)
    })
  }, [args.messageCustomerId])

  const updateMessage = () => {
    MessageService.updateMessageById({
      id: args.messageCustomerId,
      data: {
        customerMessageCategories: message.customerMessageCategories,
        customerMessageContent: message.customerMessageContent,
        customerRecordPhone: message.customerMessagePhone,
        isDeleted: 0
      }
    }).then(() => {
      closeModal()
      fetchMessage()
    })
  }

  const handleChangeValue = (name, e) => setMessage({...message, [name]: e.target.value})

  return (
    <Modal
      visible
      okText={translation('landing.confirm')}
      cancelText={translation('listCustomers.cancel')}
      width={400}
      closable={false}
      onCancel={() => closeModal()}
      onOk={updateMessage}
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 22 }}>
        <Form.Item label='NỘI DUNG'>
          <Input.TextArea value={message.customerMessageContent} onChange={e => handleChangeValue("customerMessageContent", e)}/>
        </Form.Item>
        <Form.Item label='SDT'>
          <Input value={message.customerMessagePhone} onChange={e => handleChangeValue("customerMessagePhone", e)} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateMessageModal
