// import { PageLayout } from 'components/PageLayout/PageLayout'
import React from 'react'
import * as sc from './FeedDetail.styled'
import { convertDateToDisplayFormat } from 'helper/date'
import { convertTextToHTML } from 'helper/common'
import ResponsiveEmbed from 'react-responsive-embed'

export const FeedDetailView = ({detailPost, showModal, classTitle=""}) => {
  const isEmbeddedCode = detailPost?.embeddedCode?.includes('<iframe')
  return (
    <>
      <sc.Image bg={detailPost?.stationNewsAvatar || ''} />
      <div className="out-sidehme">
        <sc.styleNew>
          <sc.Title className={`title-normal ${classTitle}`}>{detailPost?.stationNewsTitle}</sc.Title>
          <sc.Author className="text-small">
            <div>
              <div>{detailPost?.totalViewed || 0} lượt xem</div>
              <div>Ngày đăng: {convertDateToDisplayFormat(detailPost?.createdAt) || convertDateToDisplayFormat(new Date())}</div>
            </div>
            {
              showModal &&
              <div>
                <sc.Share onClick={() =>showModal()}>Chia sẻ</sc.Share>
              </div>
            }
          </sc.Author>
          <sc.DividerSmall />

          <sc.Description
            className="text-small table-responsive"
            dangerouslySetInnerHTML={{
              __html: convertTextToHTML(detailPost?.stationNewsContent)
            }}
          />
          {detailPost?.embeddedCode && isEmbeddedCode && (
            <sc.IFrameResponsive>
              <ResponsiveEmbed src={getVideoSrc(detailPost?.embeddedCode)} allowFullScreen /> :
            </sc.IFrameResponsive>
          )}
          {detailPost?.embeddedCode && !isEmbeddedCode && (
            <div dangerouslySetInnerHTML={{ __html: detailPost?.embeddedCode }} className="mt-1 mb-2" />
          )}
        </sc.styleNew>
      </div>
    </>
  )
}

const getVideoSrc = (embeddedCode) => {
  const matches = embeddedCode.match(/src="([^"]*)"/i)
  return matches && matches[1]
}
