
const errorcode = {
  SUCCESS: 0,
  FAILED: -1,
  ROUTER_FAILED: 2,                            // 路由错误
  DB_FAILED: 3,                                // 数据库操作失败
  SESSION_NOEXISTS: 4,                         // session不存在
  SOCKET_FAILED: 5,                            // socket 失败
  OBJECT_NOEXISTS: 6,                          // 目标不存在
  OBJECT_EXISTS: 7,                            // 目标已经存在
  OBJECT_NO_PERMISSION: 8,                     // 目标操作没有权限
  PARAMS_FAILED: 9,                            // 参数不正确

  U_NOEXISTS: 1101,                             // 用户不存在
  U_PASSWORD_FAILED: 1102,                      // 密码不正确
  U_NO_PERMISSION: 1103,                        // 没有权限
  U_OFFLINE: 1104,                              // 不在线
  U_ONLINE: 1105,                               // 已经在线
  DEL_FAILED: 1106,                             // 删除操作失败
  SET_FAILED: 1107,                             // 设置操作失败
  ADD_FAILED: 1108	                             // 添加操作失败
}

module.exports = errorcode;