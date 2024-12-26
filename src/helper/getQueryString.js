import queryString from 'query-string'

export const getQueryString = (query) => {
  const result = queryString.stringify(query)
  if (!result)
    return ''
  return `?${result}`
}

export const debounced = (delay, fn) => {
  let timerId
  return (...args) => {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      fn(...args)
      timerId = null
    }, delay)
  }
}

export const capitalizeFirstLetter = (stringText) => {
  return stringText.charAt(0).toUpperCase() + stringText.slice(1)
}

export const getParameterByName = (name, url) => {
  if (!url)
    url = ''
  // eslint-disable-next-line
  name = name.replace(/[\[\]]/g, '\\$&');
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url)
  if (!results)
    return null
  if (!results[2])
    return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
