import React, { useEffect , useState } from 'react';
import { useTranslation } from 'react-i18next'
import './login.scss'
import { handleSignin } from '../../actions'
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Typography , notification , Spin } from 'antd';
import LoginService from '../../services/loginService';
import { updateUserWithFirebaseToken } from 'firebase/messaging_init_in_sw';

function Login(props) {
    const { t: translation } = useTranslation()
    const { history } = props
    const user = useSelector((state) => state.member)
    const [isLoading , setIsLoading] = useState(false);
    const { isUserLoggedIn, permissions, appUserRoleId } = user

    const dispatch = useDispatch()
    useEffect(() => {
        if (user && isUserLoggedIn) {
            history.push("/");
        }
    }, [])

    const onFinish = (values) => {
        setIsLoading(true);
        LoginService.Signin(values).then(async (result) => {
            if (!result) {
                notification['error']({
                    message: '',
                    description: translation('landing.loginFail')
                })
                return
            }

            let data = Object.keys(result).length
            if (data > 0) {
                if (result.twoFAEnable === 1) {
                    history.push('/verifying-user', result)
                } else {
                    const token = await updateUserWithFirebaseToken(result , translation);
                    dispatch(handleSignin({
                        ...result , 
                        firebaseToken : token
                    }))
                    //truyền token lên param để xử lý lần đầu sau khi login
                    history.push(`/login-success?token=${result.token}`)
                }
            } else {
                notification['error']({
                    message: '',
                    description: translation('landing.loginFail')
                })
            }
            setIsLoading(false);
        })
    }

    if(isLoading) {
      return (<Spin />)
    }

    return (
        <main className="login">
            <div className="login_form__title">{translation('landing.login')}</div>
            <Form
                name="login"
                autoComplete="off"
                onFinish={onFinish}
            >
                <div className="row d-flex justify-content-center">
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: translation('landing.invalidAccount'),
                            },
                        ]}
                        className="col-12 col-md-6 col-lg-4"
                    >
                        <Input
                            placeholder={translation('landing.account')}
                            type="text"
                            size="large"
                            style={{height:'46px'}}
                        />
                    </Form.Item>
                </div>

                <div className="row d-flex justify-content-center">
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: translation('landing.invalidPassword'),
                            },
                        ]}
                        className="col-12 col-md-6 col-lg-4"
                    >
                        <Input.Password
                            placeholder={translation('landing.password')}
                            size="large"
                            className='style_mobie'
                            style={{height:'46px'}}
                        />
                    </Form.Item>
                </div>
                <div className="row d-flex justify-content-center">
                    <Form.Item className='w-100'>
                        <div className='login_form__wrap col-12 col-md-6 col-lg-4'>
                            <div className='d-flex w-100 justify-content-between align-items-center theme-color-text'>
                                <Typography.Link
                                    onClick={() => history.push("/fogot-password")}
                                >
                                   {translation("landing.fogotPassword")}
                                </Typography.Link>
                                <Button
                                    className="login-btn blue_button"
                                    data-loading-text={translation('landing.processing')}
                                    htmlType="submit"
                                    size="large"
                                >
                                    {translation('landing.login')}
                                </Button>
                            </div>
                        </div>
                    </Form.Item>
                </div>
            </Form>
        </main>
    )
}
export default Login;