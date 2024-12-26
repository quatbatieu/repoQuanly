import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import './index.scss';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import useWindowDimensions from 'hooks/window-dimensions';

const { useBreakpoint } = Grid;

export const BackButton = ({ visible, actionUrl, icon = <ArrowLeftOutlined />, onClick }) => {
  const history = useHistory();

  if (!visible) return false;

  return (
    <Button
      type="link"
      icon={icon}
      style={{ color: "currentcolor" }}
      className='d-flex justify-content-start align-items-center w-100'
      onClick={() => {
        if (onClick) {
          onClick();
        } else {
          history.push(actionUrl);
        }
      }}
    />
  );
};

const HeaderContent = ({ title }) => {
  const headerTitle = title ? title[0].toUpperCase() + title.slice(1) : '';
  return (
    <div className='sticky-header-title' style={{ color: "currentcolor" }}>
      <div>{headerTitle}</div>
    </div>
  )
};

export const QuestionButton = ({ visible, actionUrl, icon = <QuestionCircleOutlined style={{ fontSize: 17, color: "#0C42BC", color: "currentColor" }} />, onClick }) => {
  const history = useHistory();
  if (!visible) return false;

  return (
    <div className='cursor style-color'>
      <Button
        type="link"
        icon={icon}
        style={{ color: "currentcolor" }}
        className='d-flex justify-content-end align-items-center w-100'
        onClick={() => {
          if (onClick) {
            onClick();
          } else {
            history.push(actionUrl);
          }
        }}
      />
    </div>
  );
};

const PopupHeader = ({
  backButtonVisible = true,
  backButtonActionUrl = null,
  backButtonIcon,
  screenHeaderTitle = null,
  askQuestionButtonVisible = false,
  askQuestionButtonActionUrl = null,
  askQuestionButtonIcon,
  headerStyles = {},
  onBackButtonClick,
  onQuestionButtonClick,
  headerBackgroundColor = "var(--main-primary)",
  headerVisible = true,
  headerbreakpoint = 9999,
  className = '',
}) => {
  const { width } = useWindowDimensions();
  const backButtonRef = useRef(null);
  const questionButtonRef = useRef(null);

  useEffect(() => {
    if (questionButtonRef.current) {
      if (questionButtonRef.current.offsetWidth > backButtonRef.current.offsetWidth) {
        backButtonRef.current.style.width = `${questionButtonRef.current.offsetWidth}px`;
      }
      if (questionButtonRef.current.offsetWidth < backButtonRef.current.offsetWidth) {
        questionButtonRef.current.style.width = `${backButtonRef.current.offsetWidth}px`;
      }
    }

  }, [questionButtonRef.current, backButtonRef.current]);

  if (!headerVisible || width > headerbreakpoint) return null;

  const styles = {
    backgroundColor: headerBackgroundColor,
    color: "#fff",
    height: 94,
    ...headerStyles,
  };

  return (
    <div className={`sticky-header ${className}`} style={styles}>
      <div ref={backButtonRef}>
        <BackButton
          visible={backButtonVisible}
          actionUrl={backButtonActionUrl}
          icon={backButtonIcon}
          onClick={onBackButtonClick}
        />
      </div>
      <div style={{ flex: 1 }} className='d-flex justify-content-center'>
        <HeaderContent title={screenHeaderTitle} />
      </div>
      <div ref={questionButtonRef}>
        <QuestionButton
          visible={askQuestionButtonVisible}
          actionUrl={askQuestionButtonActionUrl}
          icon={askQuestionButtonIcon}
          onClick={onQuestionButtonClick}
        />
      </div>
    </div>
  );
};

PopupHeader.propTypes = {
  backButtonVisible: PropTypes.bool, // Xác định nút Back có nên hiển thị hay không.
  backButtonActionUrl: PropTypes.string, // URL chuyển hướng khi nhấp vào nút Back.
  backButtonIcon: PropTypes.element, // Biểu tượng cho nút Back.
  screenHeaderTitle: PropTypes.element, // Tiêu đề cho Header.
  askQuestionButtonVisible: PropTypes.bool, // Xác định nút Hỏi có nên hiển thị hay không.
  askQuestionButtonActionUrl: PropTypes.string, // URL chuyển hướng khi nhấp vào nút Hỏi.
  askQuestionButtonIcon: PropTypes.element, // Biểu tượng cho nút Hỏi.
  headerStyles: PropTypes.object, // Các kiểu CSS tùy chỉnh cho Header.
  onBackButtonClick: PropTypes.func, // Hàm callback khi nhấp vào nút Back.
  onQuestionButtonClick: PropTypes.func, // Hàm callback khi nhấp vào nút Hỏi.
  headerBackgroundColor: PropTypes.string, // Màu nền cho Header.
  headerVisible: PropTypes.bool, // Xác định Header có nên hiển thị hay không.
  breakpoint: PropTypes.number, // Điểm ngắt có nên hiển thị hay không.
  className: PropTypes.string, // ClassName tùy chỉnh cho tiêu đề.
};
export default PopupHeader;

export const PopupHeaderContainer = (props) => {
  const screens = useBreakpoint();
  const isMoblie = !screens.md;

  if (isMoblie) {
    return (
      <div style={{ padding: "0px 16px", width: '100%', background: "var(--main-primary)" }}>
        <PopupHeader
          screenHeaderTitle={props.screenHeaderTitle}
          backButtonVisible={true}
          askQuestionButtonVisible={false}
          onBackButtonClick={props.onCloseButtonClick}
        />
      </div>
    )
  }

  return (
    <div style={{ padding: "0px 16px", width: '100%', background: "var(--main-primary)" }}>
      <PopupHeader
        screenHeaderTitle={props.screenHeaderTitle}
        backButtonVisible={props.backButtonVisiblePC || false}
        backButtonIcon={props.backButtonIconPC}
        backButtonActionUrl={props.backButtonActionUrlPC}
        onBackButtonClick={props.onBackButtonClickPC}
        askQuestionButtonVisible={true}
        askQuestionButtonIcon={<CloseOutlined style={{ cursor: 'pointer', color: 'white' }} />}
        onQuestionButtonClick={props.onCloseButtonClick}
      />
    </div>
  )
}

PopupHeaderContainer.propTypes = {
  screenHeaderTitle: PropTypes.string,
  onCloseButtonClick: PropTypes.func,
  backButtonVisiblePC: PropTypes.bool, // Xác định nút Back có nên hiển thị hay không.
  backButtonActionUrlPC: PropTypes.string, // URL chuyển hướng khi nhấp vào nút Back.
  backButtonIconPC: PropTypes.element, // Biểu tượng cho nút Back.
  onBackButtonClickPC: PropTypes.func, // Hàm callback khi nhấp vào nút Back.
};