import defaultSettings from '@/settings'

const title = defaultSettings.title || '江西路桥安全生产管理信息化平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
