import React from "react";
import { Layout } from "antd";
import { useSelector } from "react-redux";
import "./footer.scss";
import { useHistory } from "react-router";

import IconLogo from "../../../assets/icons/logo.png";
import BCT from "../../../assets/icons/bct.png";
import BCT2 from "../../../assets/icons/bct2.png";
import { useModalDirectLinkContext } from "components/ModalDirectLink";
import { useTranslation } from "react-i18next";
const { Footer: FooterAntd } = Layout;

export default function Footer() {
  const history = useHistory();
  const stationsIntroduction = useSelector((state) => state.introduction);
  const setting = useSelector((state) => state.setting);
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();
  const { t: translate } = useTranslation()


  return (
    <FooterAntd>
      <div className="footer">
        <div className="row w-100 mt-2">
          {/*  */}
          <div className="col-12 col-md-3">
            <div className="row">
              <div className="w-auto">
                <img
                  src={setting.stationsLogo || IconLogo}
                  className="footer_logo"
                />
              </div>
              <div className="col-6 pt-1">
                <span className="footer_slogan text-white">
                  {setting.stationIntroductionSlogan}
                </span>
              </div>
              <div className="col-6 pt-1">
                <p>
                  <span className="footer_slogan">
                    {setting.stationsLicense}
                  </span>{" "}
                  <br />
                  <span className="footer_slogan">
                    {setting.stationsCertification}
                  </span>
                </p>
              </div>
              <div></div>
              <div>
                {setting.stationsVerifyStatus === 1 ? (
                  <img width={200} src={BCT} alt="bct" />
                ) : setting.stationsVerifyStatus === 2 ? (
                  <img width={200} src={BCT2} alt="bct2" />
                ) : (
                  <></>
                )}
              </div>
            </div>
            {/* <div className="footer_subTitle">
              {stationsIntroduction.stationIntroServices}
            </div> */}
          </div>
          {/*  */}
          <div className="col-12 col-md-3">
            <div className="content-mx-auto">
              <div className="footer_section">{translate('info-contact')}</div>
              <ul className="footer_section_content">
                <li>
                  <span className="info-title">{translate('setting')}:</span><br />
                  <span
                    dangerouslySetInnerHTML={{
                      __html: setting.stationsAddress || "<br />"
                    }}
                    className="info-content"
                  />
                </li>
                <li>
                  <span className="info-title">{translate('landing.phoneNumber')}:</span><br />
                  <span className="info-content">{translate('setting.hotline')}: {setting.stationsHotline}</span>
                </li>
                <li>
                  <span className="info-title">Email:</span><br />
                  <span className="info-content">{setting.stationsEmail}</span>
                </li>
              </ul>
            </div>
          </div>
          {/*  */}
          <div className="col-12 col-md-3">
            <div className="content-mx-auto">
              <div className="footer_section">{translate('connect')}</div>
              <ul className="footer_section_content">
                <li onClick={() => history.push("/")}>
                  <span>{translate('homepage')}</span>
                </li>
                <li onClick={() => history.push("/booking-schedule")}>
                  <span>{translate('booking.btnAdd')}</span>
                </li>
                <li onClick={() => history.push("/new-public")}>
                  <span>{translate('header.new')}</span>
                </li>
                <li onClick={() => history.push("/")}>
                  <span>{translate('contact')}</span>
                </li>
                <li onClick={() => setUrlForModalDirectLink(`${window.origin}/Dieu_khoan_thanh_toan_va_bao_mat.docx`)}>
                  <span>{translate('Terms-payment')}</span>
                </li>
                <li onClick={() => setUrlForModalDirectLink(`${window.origin}/Dieu_khoan_thanh_toan_va_bao_mat.docx`)}>
                  <span>{translate('setting.security')}</span>
                </li>
              </ul>
            </div>
          </div>
          {/*  */}
          <div className="col-12 col-md-3">
            <div className="text-center mb-2 footer_section">
              {translate('setting.externalLink')}
            </div>
            <div className="d-flex justify-content-center">
              {stationsIntroduction.stationFacebookUrl && (
                <a
                  href={
                    stationsIntroduction.stationFacebookUrl.startsWith(
                      "http://"
                    )
                      ? stationsIntroduction.stationFacebookUrl
                      : "http://" + stationsIntroduction.stationFacebookUrl
                  }
                  target="_blank"
                >
                  <span
                    class="iconify footer_icon"
                    data-icon="brandico:facebook-rect"
                  ></span>
                </a>
              )}
              {stationsIntroduction.stationInstagramUrl && (
                <a
                  href={
                    stationsIntroduction.stationInstagramUrl.startsWith(
                      "http://"
                    )
                      ? stationsIntroduction.stationInstagramUrl
                      : "http://" + stationsIntroduction.stationInstagramUrl
                  }
                  target="_blank"
                >
                  <span
                    class="iconify footer_icon"
                    data-icon="bi:instagram"
                  ></span>
                </a>
              )}
              {stationsIntroduction.stationTwitterUrl && (
                <a
                  href={
                    stationsIntroduction.stationTwitterUrl.startsWith("http://")
                      ? stationsIntroduction.stationTwitterUrl
                      : "http://" + stationsIntroduction.stationTwitterUrl
                  }
                  target="_blank"
                >
                  <span
                    class="iconify footer_icon"
                    data-icon="akar-icons:twitter-fill"
                  ></span>
                </a>
              )}
              {stationsIntroduction.stationYoutubeUrl && (
                <a
                  href={
                    stationsIntroduction.stationYoutubeUrl.startsWith("http://")
                      ? stationsIntroduction.stationYoutubeUrl
                      : "http://" + stationsIntroduction.stationYoutubeUrl
                  }
                  target="_blank"
                >
                  <span
                    class="iconify footer_icon"
                    data-icon="akar-icons:youtube-fill"
                  ></span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </FooterAntd>
  );
}
