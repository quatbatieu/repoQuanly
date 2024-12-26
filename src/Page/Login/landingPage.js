import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'
import './login.scss'
import { notification } from 'antd'
import './landing.scss'
import LoginService from 'services/loginService';
import _ from 'lodash';

function LandingPage() {
	const { t: translation } = useTranslation()
	const [dataIntro, setDataIntro] = useState({})

	const fetchDataIntroduction = () => {
    const DOMAIN = window.origin.split('://')[1]
		LoginService.getLandingPageInfo(DOMAIN).then(result => {
			if (result) {
				setDataIntro(result)
			} else {
				notification.error({
					message: "",
					description: translation('landing.error')
				})
			}
		})
	}

	useEffect(() => {
		fetchDataIntroduction()
	}, [])

	function convertTextToHTML(text = '') {
		if (!text)
			return '';
		else
			return text.replace(/\n/g, "<br />")
	}

  const stationIntroSection1Content = JSON.parse( 
    dataIntro?.stationIntroSection1Content?.includes("{") 
    ? dataIntro.stationIntroSection1Content
    : "{}")
  const stationIntroSection2Content = JSON.parse(
    dataIntro?.stationIntroSection2Content?.includes("{") 
    ? dataIntro.stationIntroSection2Content
    : "{}"
  )

  return (
    <main className='introduction_container'>
      <div className='introduction_container__title'>GIỚI THIỆU VỀ CHÚNG TÔI</div>
      <img src={dataIntro?.slideBanners || ""} alt="image"/>
          
      <div className='m-auto'>
        <div className='introduction_container__section'>
          <div>{dataIntro?.stationIntroductionTitle || ""}</div>
          <div
            dangerouslySetInnerHTML={{
              __html: convertTextToHTML(dataIntro?.stationIntroductionContent || "")
            }}
          />
        </div>

        <div className='introduction_container__section'>
          <div>{stationIntroSection1Content?.title || ""}</div>
          <div
            dangerouslySetInnerHTML={{
              __html: convertTextToHTML(stationIntroSection1Content?.content || "")
            }}
          />
        </div>

        <div className='introduction_container__section'>
          <div>{stationIntroSection2Content?.title || ""}</div>
          <div
            dangerouslySetInnerHTML={{
              __html: convertTextToHTML(stationIntroSection2Content?.content || "")
            }}
          />
        </div>
      </div>
    </main>
  )
}


export default LandingPage;