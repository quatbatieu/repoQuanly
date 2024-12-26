import React from 'react'
import './post.scss'
import { Image } from 'antd'
import moment from 'moment'

export function HotPost({ post, setViewDetailPost }) {
    function renderDescription(text = '') {
        if(!text)
            return '';
        else 
            return text.replace(/\n/g, "<br />")
    }

    return (
        <div className="old_post_component pointer" 
        onClick={() => setViewDetailPost(post.stationNewsId)}>
            <div className="row">
                <div className="col-12 col-lg-6">
                    <Image
                        alt="image"
                        width="100%"
                        preview={false}
                        src={post.stationNewsAvatar}
                        className="old_post_component__content_left"
                    />
                </div>
                <div className="col-12 col-lg-6">
                    <div className="old_post_component__content_right">
                        <div className="old_post_component__content_right__title">
                            {post.stationNewsTitle}
                        </div>
                        <div className="old_post_component__content_right__time">
                            {moment(post.createdAt).locale('vi').format("LT")}{' '}{moment(post.createdAt).format('DD/MM/YYYY')}
                        </div>
                        <div 
                            className="old_post_component__content_right__content short"
                            dangerouslySetInnerHTML={{__html: renderDescription(post.stationNewsContent)}}
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}