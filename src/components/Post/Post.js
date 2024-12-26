import React from 'react'
import { Card, Image } from 'antd'
import moment from 'moment'

export function Post({ post, setViewDetailPost, className, hideImage }) {
    function renderDescription(text = '') {
        if(!text)
            return '';
        else 
            return text.replace(/\n/g, "<br />")
    }

    return (
        <Card
            type="inner"
            className={`mb-3 pointer border-0 border-bottom ${className ? className : ""}`}
            onClick={() => setViewDetailPost(post.stationNewsId)}
        >
            <div className="new_component__title">{post.stationNewsTitle}</div>
            <Card.Meta
                description={`${moment(post.createdAt).format('LT')} ${moment(post.createdAt).format('DD/MM/YYYY')}`}
            />
            {(post.stationNewsAvatar && !hideImage) && <Image
                alt="image"
                style={{maxHeight: 465}}
                src={post.stationNewsAvatar}
                preview={false}
                width="100%"
            />}
            <div className="new_component__content_left_description short"
                dangerouslySetInnerHTML={{__html: renderDescription(post.stationNewsContent)}}
            />
        </Card>
    )
}