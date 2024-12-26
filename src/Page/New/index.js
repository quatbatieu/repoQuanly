import React, { useState, useEffect } from 'react'
import { Tabs, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import NewService from '../../services/newService'
import _ from 'lodash'
import ListNews from './listNews'
import PostNew from './postNew'
import CategoryNew from './CategoryNew'
import { LIST_PERMISSION } from 'constants/permission'

const { TabPane } = Tabs

const LIST_NEWS_KEY = '#1'
const POST_NEW_KEY = '#2'
const CREATE_CATEGORY_KEY = "#3"

function New(props) {
  const { t: translation } = useTranslation()
  const [activeKey, setActiveKey] = useState(LIST_NEWS_KEY)
  const [selectedImage, setSelectedImage] = useState({
    imageFile: null,
    imageUrl: null,
  })
  const [selectedPost, setSelectedPost] = useState(null)
  const [isReload, setIsReload] = useState(false)
  const [listCategory, setListCategory] = useState([])

  useEffect(() => {
    if(!props.member?.permissions?.includes(LIST_PERMISSION.MANAGE_NEWS)) {
      props.history.push('/');
    }
    NewService.userFetchListCategory().then((result) => {
      setListCategory(result)
    })
  }, [])

  const onSelectPostEdit = async (postId) => {
    //get post detail
    NewService.adminGetDetailById(postId).then((result) => {
      if (result && !_.isEmpty(result)) {
        result.stationNewsAvatar &&
        setSelectedImage({ imageUrl: result.stationNewsAvatar })
        setSelectedPost(result)
        setActiveKey(POST_NEW_KEY)
      } else {
        if (selectedPost || !_.isEmpty(selectedPost)) {
          setSelectedPost(null)
        }
        notification['error']({
          message: '',
          description: notification['error']({
            message: '',
            description: translation('new.fetchDataFailed'),
          }),
        })
      }
    })
  }

  useEffect(() => {
    // Back to top when change tabs
    window.scrollTo(0, 0)
  }, [activeKey])
  
  useEffect(() => {
    if (window.location.hash) {
      if (window.location.hash !== activeKey) {
        setActiveKey(window.location.hash)
      }
    } else {
      if (activeKey !== LIST_NEWS_KEY) {
        setActiveKey(LIST_NEWS_KEY)
      }
    }
  }, [window.location.hash])

  return (
    <>
      <Tabs
        activeKey={activeKey}
        destroyInactiveTabPane={true}
        onChange={(key) => {
          setActiveKey(key)
          window.location.hash = key
          if (key === LIST_NEWS_KEY && selectedPost) {
            setSelectedPost(null)
            setSelectedImage({
              imageFile: null,
              imageUrl: '',
            })
          }
        }}
      >
        <TabPane key={LIST_NEWS_KEY} tab={translation('new.list')}>
          <ListNews
            isReload={isReload}
            isActive={activeKey === LIST_NEWS_KEY}
            setIsReload={setIsReload}
            onSelectPostEdit={onSelectPostEdit}
            listCategory={listCategory}
          />
        </TabPane>
        <TabPane key={POST_NEW_KEY} tab={translation('new.post')}>
          <PostNew
            setIsReload={setIsReload}
            oldPost={selectedPost}
            oldPostImage={selectedImage}
            defaultKey={LIST_NEWS_KEY}
            isActive={activeKey === LIST_NEWS_KEY}
            setActiveKey={setActiveKey}
            listCategory={listCategory}
          />
        </TabPane>
        {/* <TabPane key={CREATE_CATEGORY_KEY} tab={translation('new.categories')}>
          <CategoryNew
            key={"category-new-component"}
          />
        </TabPane> */}
      </Tabs>
    </>
  )
}

export default New
