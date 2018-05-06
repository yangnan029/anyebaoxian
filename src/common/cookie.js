export const setCookie = (i, e, o, d) => {
  d = d || null
  var domain = d != null ? 'domain=' + d + ';' : ''

  if (o) {
    let t = getsec(o)
    let a = new Date()
    a.setTime(a.getTime() + 1 * t)
    document.cookie = i + '=' + escape(e) + ';' + domain + 'path=/;expires=' + a.toGMTString()
  } else {
    document.cookie = i + '=' + escape(e)
  }
}
export const getCookie = name => {
  let arr
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  arr = document.cookie.match(reg)
  if (arr) {
    return decodeURI(unescape(arr[2]))
  } else {
    return null
  }
}
export const getsec = i => {
  let e = 1 * i.substring(1, i.length)
  let o = i.substring(0, 1)
  return o === 's' ? 1e3 * e : o === 'h' ? 60 * e * 60 * 1e3 : o === 'd' ? 24 * e * 60 * 60 * 1e3 : void 0
}
export const removeCookie = i => {
  setCookie(i, null, 'd0')
}
/**
 * 获得cookie的json值
 * @param name
 * @returns
 */
export const getJsonCookie = name => {
  var value = getCookie(name)
  if (value != null) {
    return JSON.parse(value)
  } else {
    return null
  }
}
