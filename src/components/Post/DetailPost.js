import React from 'react'
import { Card, Image, Modal } from 'antd'
import moment from 'moment'

export function DetailPost({ post, isOpen, closeModal }) {
  function renderDescription(text = '') {
    if(!text)
        return '';
    else 
        return text.replace(/\n/g, "<br />")
  }

  return (
		<Modal
			visible={isOpen}
			onCancel={closeModal}
      width="746px"
			footer={null}
		>
      <Card
        type="inner"
        className="mb-3 border-0"
        title={post.stationNewsTitle}
      >
        <Card.Meta
          description={`${moment(post.createdAt).format('LT')} ${moment(post.createdAt).format('DD/MM/YYYY')}`}
        />
        {post.stationNewsAvatar && <Image
          alt="image"
          style={{maxHeight: 465}}
          width="100%"
          src={post.stationNewsAvatar}
        />}
        <div className="new_component__content_left_description"
          dangerouslySetInnerHTML={{__html: renderDescription(post.stationNewsContent)}}
        />
      </Card>
    </Modal>
  )
}