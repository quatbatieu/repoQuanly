import requestService from './request'

function sendMail(data) {

  return requestService.send({
    method: 'post',
    path: 'https://send-grid-mail.herokuapp.com/sendmail',
    data: { ...data },
  })
}
export default {
  sendMail
}
