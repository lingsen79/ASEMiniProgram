const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wxdf90488513e663d2',

    // 微信小程序 App Secret
    appSecret: '',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,// false 就不需要secret的认证

    // serverHost: 'localhost',
    // tunnelServerUrl: '',
    // tunnelSignatureKey: '27fb7d1c161b7ca52d73cce0f1d833f9f5b5ec89',    
    // qcloudAppId: '1256564161',
    // qcloudSecretId: '您的腾讯云 SecretId',
    // qcloudSecretKey: '您的腾讯云 SecretKey',
    // wxMessageToken: 'weixinmsgtoken',
    networkTimeout: 30000,
    
    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        minidb:'asemini',
        //db:'asemini',
        pass: 'wxdf90488513e663d2',
        //pass: 'root',
        char: 'utf8mb4'
    },

    // log4js: {
    //   appenders: {
    //     ruleConsole: { type: 'console' },
    //     ruleFile: {
    //       type: 'dateFile',
    //       filename: __dirname+'./logs/server-',
    //       pattern: 'yyyy-MM-dd.log',
    //       maxLogSize: 10 * 1000 * 1000,
    //       numBackups: 10,
    //       alwaysIncludePattern: true
    //     }
    //   },
    //   categories: {
    //     dev: { appenders: ['ruleFile'], level: 'info' },
    //     default: { appenders: ['ruleConsole', 'ruleFile'], level: 'debug' }
    //   }
    // },
    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF
