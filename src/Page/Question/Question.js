import React, { useMemo } from 'react'
import { Col, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next';
import "./question.scss";
import { questionCentral , questionUser} from 'constants/question';

function QuestionItem({ title, path, index }) {
  return (
    <div className='question-item'>
      <div className='question-item__index'>
        {index}
      </div>
      <a className='question-item__title' href={path} target='_blank'>
        {title}
      </a>
    </div>
  )
}

function Question() {
  const { t: translation } = useTranslation()

  const questionCentralData = useMemo(() => {
    return questionCentral(translation)
  }, [translation])

  const questionUserData = useMemo(() => {
    return questionUser(translation)
  }, [translation])

  return (
    <div className='question'>
      <Typography.Title className='question__title'>
        {translation("question.title")}
      </Typography.Title>
      <Typography.Title level={3} className="question__title-sub">
        {(translation("question.titleSub"))}
      </Typography.Title>
      <Typography className='question__desc'>
        {translation("question.desc")}
      </Typography>
      <div className='question__box'>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={24} lg={12} >
            <Typography.Title level={3} className="question__box__title">
              {translation("question.titleCentral")}
              <div className='question__box__list mt-35'>
                {questionCentralData.map((item, index) =>
                  <QuestionItem path={item.path} title={item.title} index={index + 1} key={index + 1} />
                )}
              </div>
            </Typography.Title>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} >
            <Typography.Title level={3} className="question__box__title">
              {translation("question.titleUser")}
              <div className='question__box__list'>
                {questionUserData.map((item, index) =>
                  <QuestionItem path={item.path} title={item.title} index={index + 1} key={index + 1} />
                )}
              </div>
            </Typography.Title>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Question;