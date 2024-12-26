import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Input, notification, Form, Layout } from "antd";
import "./settingLanding.scss";
import { Menu } from "components/Widgets";
import LoginService from "services/loginService";
import { convertFileToBase64 } from "helper/common";
import uploadService from "../../services/uploadService";
import "../../components/Widgets/Footer/footer.scss";
import IconLogo from "../../assets/icons/logo.png";
import { InboxOutlined } from "@ant-design/icons";
import Dragger from "antd/lib/upload/Dragger";

const { Footer: FooterAntd } = Layout;

const MAX_MULTI_IMAGE = 3;

function SettingLandingPage() {
  const { t: translation } = useTranslation();
  const [formIntro] = Form.useForm();
  const [formSection1] = Form.useForm();
  const [formSection2] = Form.useForm();
  const [formFooter] = Form.useForm();
  const [data, setData] = useState({});
  const [images, setImages] = useState([]);
  const [uploadMultiImages, setUploadMultiImages] = useState([]);
  const user = useSelector((state) => state.member);
  const stationsIntroduction = useSelector((state) => state.introduction);
  const setting = useSelector((state) => state.setting);
  const imageRef = useRef(null);
  const [imageIndex, setImageIndex] = useState(0);

  const fetchDataIntroduction = () => {
    LoginService.getLandingPageInfoAuth(user.stationsId).then((result) => {
      if (result) {
        formIntro.setFieldsValue({ ...result });
        if (result.stationIntroSection1Content) {
          // const newSection1Content = JSON.parse(result.stationIntroSection1Content)
          const newSection1Content = result.stationIntroSection1Content;
          formSection1.setFieldsValue({
            title: newSection1Content.title,
            content: newSection1Content.content,
          });
        }
        if (result.stationIntroSection2Content) {
          // const newSection2Content = JSON.parse(result.stationIntroSection2Content)
          const newSection2Content = result.stationIntroSection2Content;
          formSection2.setFieldsValue({
            title: newSection2Content.title,
            content: newSection2Content.content,
          });
        }
        formFooter.setFieldsValue({ ...result });

        setImages([]);
        if (result.stationIntroductionMedia !== "") {
          setImages((prevImages) => [
            ...prevImages,
            result.stationIntroductionMedia,
          ]);
        }
        if (result.stationIntroSection1Media !== "") {
          setImages((prevImages) => [
            ...prevImages,
            result.stationIntroSection1Media,
          ]);
        }
        if (result.stationIntroSection2Media !== "") {
          setImages((prevImages) => [
            ...prevImages,
            result.stationIntroSection2Media,
          ]);
        }
      } else {
        notification.error({
          message: "",
          description: translation("landing.error"),
        });
      }
    });
  };

  const uploadSpecificImage = async () => {
    if (!imageRef.current?.files || !imageRef.current.files[0]) {
      return;
    }

    const reader = new FileReader();
    const fileType = imageRef.current.files[0]?.type;
    reader.addEventListener("load", async (e) => {
      const localFilePath = e.target?.result;

      await uploadService
        .uploadImage({
          imageData: localFilePath.replace("data:" + fileType + ";base64,", ""),
          imageFormat: fileType.replace("image/", ""),
        })
        .then((result) => {
          if (result) {
            console.log(result);
            const key = imageIndex === 0 ? "stationIntroductionMedia" : `stationIntroSection${imageIndex}Media`;

            const clone = [...uploadMultiImages];
            clone[imageIndex] = result.data;

            console.log(clone);
            updateStation({
              [key]: clone[imageIndex],
            });
          } else {
            notification.error({
              message: "",
              description: translation("setting.uploadListImageFail"),
            });
          }
        });
    });

    reader.readAsDataURL(imageRef.current.files[0]);





  }

  const onClickChooseImage = (index) => {
    setImageIndex(index);
    if (imageRef.current) {
      imageRef.current.click();
    }
  }

  useEffect(() => {
    fetchDataIntroduction();
    return () => { };
  }, []);

  useEffect(() => {
    if (uploadMultiImages.length === 0) { return }
    const index = uploadMultiImages.length - 1;
    const key = index == 0 ? "stationIntroductionMedia" : `stationIntroSection${index}Media`
    updateStation({
      [key]: uploadMultiImages[index],
    });
  }, [uploadMultiImages])

  const onChooseBanner = (options) => {
    const { onSuccess, onError, file } = options;
    if (file.size >= 1e7) {
      notification["error"]({
        message: "",
        description: translation("setting.errImg"),
      });
      onError("error");
      return;
    }
    onSuccess("Ok");
    onSaveBanner(file);
  };

  async function updateStation(data = {}) {
    await uploadService
      .updateStationIntroduction({
        id: user.stationsId,
        data: data,
      })
      .then((result) => {
        if (result.issSuccess) {
          notification.success({
            message: "",
            description: translation("accreditation.updateSuccess"),
          });
          fetchDataIntroduction();
        } else {
          notification.error({
            message: "",
            description: translation("landing.error"),
          });
        }
      });
  }

  const onSaveBanner = async (file) => {
    await convertFileToBase64(file).then(async (dataUrl) => {
      // const newData = dataUrl.replace(/,/gi, '').split('base64')
      await uploadService
        .uploadImage({
          imageData: dataUrl.replace("data:" + file.type + ";base64,", ""),
          imageFormat: file.type.replace("image/", ""),
        })
        .then((result) => {
          if (result) {
            setUploadMultiImages((prevUploadMultiImages) => [
              ...prevUploadMultiImages,
              result.data
            ]);
          } else {
            notification.error({
              message: "",
              description: translation("setting.uploadListImageFail"),
            });
          }
        });
    });
  };

  const onSaveSection = async (values) => {
    await updateStation({
      ...values,
    });
  };

  const onSubmitSection1 = async (values) => {
    await updateStation({
      stationIntroSection1Content: JSON.stringify(values),
    });
  };

  const onSubmitSection2 = async (values) => {
    await updateStation({
      stationIntroSection2Content: JSON.stringify(values),
    });
  };

  const onSaveInfoFooter = async (values) => {
    for (let k of values) {
      if (!values[k]) {
        delete values[k];
      }
    }
    await updateStation(values);
  };

  const props = {
    name: "file",
    multiple: true,
    maxCount: MAX_MULTI_IMAGE,
    accept: "image/*",
    customRequest: onChooseBanner,
    showUploadList: true,
    className: "mb-5",
  };

  return (
    <>
      <Menu Features={"HOME"} />
      {/*  */}
      <div className="container">
        <div className="intro_title">{translation('aboutUs')}</div>
        <div className="mb-2">
          {images.length > 0 ? (
            <div className="d-flex flex-row">

              <input ref={imageRef} type={"file"} accept="image/*" hidden name="stationIntroSectionMedia" id="inputStationIntroSectionMedia" onChange={uploadSpecificImage} />

              {images.map((imgSrc, key) => {
                return (
                  <img
                    className="col-4 mb-3 img-pointer-image"
                    key={key}
                    src={imgSrc}
                    alt="image"
                    onClick={() => onClickChooseImage(key)}
                  />
                );
              })}

            </div>
          ) : (
            <div
              style={{
                height: 430,
                width: "100%",
                border: "1px solid #ccc",
              }}
            />
          )}
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{translation("new.selectImage")}</p>
          </Dragger>
        </div>
        {/* section1 */}
        <Form onFinish={onSaveSection} form={formIntro}>
          <Form.Item name="stationIntroductionTitle">
            <Input
              className="text-start my-2 introduction_title"
              placeholder={translation("new.title")}
            />
          </Form.Item>
          <div className="mb-3 introduction_introduction">
            <Form.Item name="stationIntroductionContent">
              <Input.TextArea
                className="mb-1"
                rows={13}
                placeholder={translation("new.content")}
                size="large"
              />
            </Form.Item>
          </div>
          <Form.Item>
            <div className="d-flex justify-content-center my-2">
              <Button htmlType="submit" type="primary">
                {translation("setting.save")}
              </Button>
            </div>
          </Form.Item>
        </Form>
        {/* end section1 */}

        {/* section2 */}
        {/* <Form 
					onFinish={onSubmitSection1}
					form={formSection1}
				>
					<Form.Item
						name="title"
						rules={[{ required: true, message: translation('listCustomers.invalidContent') }]}
					>
						<Input 
							className="text-start my-2 introduction_title"
							placeholder={translation('new.title')}
						/>
					</Form.Item>
					<div className="mb-3 introduction_introduction">
						<Form.Item
							name="content"
							rules={[{ required: true, message: translation('listCustomers.invalidContent') }]}
						>
							<Input.TextArea
								className="mb-1"
								rows={13}
								placeholder={translation('new.content')}
								size="large"
							/>
						</Form.Item>
					</div>
					<Form.Item>
						<div className="d-flex justify-content-center my-2">
							<Button htmlType="submit" type="primary">{translation('setting.save')}</Button>
						</div>
					</Form.Item>
				</Form> */}
        {/* end section2 */}

        {/* section3 */}
        {/* <Form 
					onFinish={onSubmitSection2}
					form={formSection2}
				>
					<Form.Item
						name="title"
						rules={[{ required: true, message: translation('listCustomers.invalidContent') }]}
					>
						<Input 
							className="text-start my-2 introduction_title"
							placeholder={translation('new.title')}
						/>
					</Form.Item>
					<div className="mb-3 introduction_introduction">
						<Form.Item
							rules={[{ required: true, message: translation('listCustomers.invalidContent') }]}
							name="content"
						>
							<Input.TextArea
								className="mb-1"
								rows={13}
								placeholder={translation('new.content')}
								size="large"
							/>
						</Form.Item>
					</div>
					<Form.Item>
						<div className="d-flex justify-content-center my-2">
							<Button htmlType="submit" type="primary">{translation('setting.save')}</Button>
						</div>
					</Form.Item>
				</Form> */}
        {/* end section3 */}
      </div>
      {/*  */}

      {/*  */}
      <Form form={formFooter} onFinish={onSaveInfoFooter}>
        <FooterAntd>
          <div className="footer">
            <div className="row w-100 mt-2">
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                <div className="row">
                  <div className="w-auto">
                    <div>
                      <img
                        src={setting.stationsLogo || IconLogo}
                        className="footer_logo"
                      />
                    </div>
                  </div>
                  <div className="col-6 pt-1">
                    <span className="footer_slogan">
                      {stationsIntroduction.stationIntroductionSlogan}
                    </span>
                  </div>
                </div>
                <div className="footer_subTitle">
                  {stationsIntroduction.stationIntroServices}
                </div>
              </div>
              {/*  */}
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                <div className="footer_section">{translation('connect')}</div>
                <ul className="footer_section_content">
                  <li onClick={() => { }}>
                    <p>{translation('homepage')}</p>
                  </li>
                  <li onClick={() => { }}>
                    <p>{translation('booking.btnAdd')}</p>
                  </li>
                  <li onClick={() => { }}>
                    <p>{translation('header.new')}</p>
                  </li>
                  <li onClick={() => { }}>
                    <p>{translation('contact')}</p>
                  </li>
                </ul>
              </div>
              {/*  */}
              {/* <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
							<div className="text-center mb-2 footer_section">Liên kết ngoài</div>
								<label className="introduction_footer">Facebook</label>
								<Form.Item
									name="stationFacebookUrl"
								>
									<Input placeholder="Facebook"/>
								</Form.Item>
								<label className="introduction_footer">Instagram</label>
								<Form.Item
									name="stationInstagramUrl"
								>
									<Input placeholder={"Instagram"}/>
								</Form.Item>
								<label className="introduction_footer">Twitter</label>
								<Form.Item
									name="stationTwitterUrl"
								>
									<Input placeholder={"Twitter"}/>
								</Form.Item>
								<label className="introduction_footer">Youtube</label>
								<Form.Item
									name="stationYoutubeUrl"
								>
									<Input placeholder={"Youtube"}/>
								</Form.Item>
							</div> */}
            </div>
            <Form.Item>
              <div className="d-flex justify-content-center">
                <Button htmlType="submit">{translation("setting.save")}</Button>
              </div>
            </Form.Item>
          </div>
        </FooterAntd>
      </Form>
    </>
  );
}
export default SettingLandingPage;
