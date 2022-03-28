module.exports = {
  title: 'Web Magic Board',

  /**
   * @type {boolean} true | false
   * 右侧 设置
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * 开启 Tags-View 导航
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * 固定 Header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * 侧边栏 Logo
   */
  sidebarLogo: true,

  /**
   * @type {boolean} true | false
   * 菜单支持拼音搜索
   */
  supportPinyinSearch: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
