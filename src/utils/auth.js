import Cookies from 'js-cookie'

const TokenKey = 'token'
const UserId = 'userId'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getUserId() {
  return Cookies.get(UserId)
}

export function setUserId(userId) {
  return Cookies.set(UserId, userId)
}
export function removeUserId() {
  return Cookies.remove(UserId)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
