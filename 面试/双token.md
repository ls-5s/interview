```js
/**
 * 前端通用网络请求函数
 * 核心：自动处理 短Token 过期，通过 长Token 无感刷新，失败则跳转登录
 * 【令牌定义】
 * 短Token(Access Token)：临时身份凭证，有效期极短(15分钟)，用于所有接口鉴权
 * 长Token(Refresh Token)：长效刷新凭证，有效期长(7天)，仅用于刷新短Token，不参与普通请求
 * 【存储位置】：两个令牌 全部存储在 浏览器本地存储 localStorage 中
 */
async function request(url, options) {
  // try 包裹：捕获代码执行中的所有异常（网络错误、接口报错等）
  try {
    // 1. 发起网络请求：从 localStorage 取出【短Token】，携带它请求后端接口
    const res = await fetch(url, {
      // 继承外部传入的请求配置（请求方式、请求体、参数等）
      ...options,
      // 请求头：携带身份凭证，后端通过短Token识别当前登录用户
      headers: {
        // 固定格式：Bearer + 空格 + 从 localStorage 获取的短Token
        Authorization: `Bearer ${getShortToken()}`,
      },
    })

    // 2. 判断后端返回状态码：401 = 【短Token 已过期/无效】，需要刷新
    if (res.status === 401) {
      // 3. 调用刷新函数：从 localStorage 取出【长Token】，去后端申请新的短Token
      // 只有长Token有效，才能获取到新的短Token
      const newShortToken = await refreshTokenByLongToken()

      // 4. 判断是否刷新成功：是否拿到了新的短Token
      if (newShortToken) {
        // 5. 刷新成功：新短Token已存入 localStorage，递归重新发起原请求（用户无感知）
        return request(url, options)
      } else {
        // 6. 刷新失败：代表【长Token 也已过期】，登录状态彻底失效
        // 强制跳转到登录页，让用户重新登录
        redirectToLogin()
      }
    }

    // 7. 请求正常（非401）：直接返回接口响应结果
    return res
  } catch (error) {
    // 8. 捕获异常：网络断开、请求超时、代码错误等，打印错误日志
    console.error('网络请求异常：', error)
  }
}

// ===================== 辅助函数（项目中必须实现）=====================
/**
 * 获取本地存储的 短Token(Access Token)
 * 【存储位置】：浏览器 localStorage -> key: short_token
 */
function getShortToken() {
  // 从浏览器本地存储 读取 短Token
  return localStorage.getItem('short_token')
}

/**
 * 使用 长Token(Refresh Token) 刷新短Token
 * @return 新的短Token（刷新失败返回 null）
 * 【长Token存储位置】：浏览器 localStorage -> key: long_token
 * 【新短Token存储位置】：刷新成功后，存入浏览器 localStorage -> key: short_token
 */
async function refreshTokenByLongToken() {
  // 第一步：从浏览器本地存储 读取 长Token
  const longToken = localStorage.getItem('long_token')
  if (!longToken) return null

  // 调用后端刷新接口
  const res = await fetch('/api/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: longToken })
  })

  const data = await res.json()
  if (data.token) {
    // 刷新成功：将 新的短Token 存入 浏览器本地存储
    localStorage.setItem('short_token', data.token)
    return data.token
  }
  return null
}

/**
 * 跳转到登录页（清空失效令牌）
 * 【清空位置】：清空浏览器 localStorage 中所有的令牌数据
 */
function redirectToLogin() {
  localStorage.clear() // 清空浏览器本地存储的所有过期令牌
  location.href = '/login' // 跳转登录
}
```
