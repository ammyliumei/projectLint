import { message } from 'ant-design-vue';
class HttpUtil {
  headers = {
    "Content-Type": "application/json; charset=UTF-8",
  };
  baseURL = "";
  constructor(parms) {
    this.baseURL = parms.baseURL || "";
    this.headers = { ...this.headers, ...params.headers };
  }
  /**
   * get 请求
   * @param url
   * @param params
   * @param isHandleError
   * @param httpCustomerOpertion 使用者传递过来的参数, 用于以后的扩展用户自定义的行为
   * {
   *    isHandleResult: boolen    //是否需要处理错误结果   true 需要/false 不需要
   *    isShowLoading: boolen     //是否需要显示loading动画
   *    customHeader: object        // 自定义的请求头
   *    timeout: int              //自定义接口超时的时间
   * }
   * @returns {Promise}
   */
  get(
    url,
    params = {},
    httpCustomerOpertion = { isHandleResult: true, isShowLoading: true }
  ) {
    if (!httpCustomerOpertion.hasOwnProperty("isHandleResult")) {
      httpCustomerOpertion.isHandleResult = true;
    }
    if (!httpCustomerOpertion.hasOwnProperty("isShowLoading")) {
      httpCustomerOpertion.isShowLoading = true;
    }
    const method = "GET";
    const fetchUrl = url + CommonTool.qs(params); // 将参数转化到url上
    const fetchParams = Object.assign({}, { method });
    return HttpUtil.handleFetchData(
      fetchUrl,
      fetchParams,
      httpCustomerOpertion
    );
  }

  /**
   * post 请求
   * @param url
   * @param params
   * @param isHandleError
   * @param httpCustomerOpertion 使用者传递过来的参数, 用于以后的扩展用户自定义的行为
   * @returns {Promise}
   */
  post(
    url,
    params = {},
    httpCustomerOpertion = { isHandleResult: true, isShowLoading: true }
  ) {
    if (!httpCustomerOpertion.hasOwnProperty("isHandleResult")) {
      httpCustomerOpertion.isHandleResult = true;
    }
    if (!httpCustomerOpertion.hasOwnProperty("isShowLoading")) {
      httpCustomerOpertion.isShowLoading = true;
    }
    const method = "POST";
    const body = JSON.stringify(params); // 将参数转化成JSON字符串
    const fetchParams = Object.assign({}, { method, body });
    return HttpUtil.handleFetchData(url, fetchParams, httpCustomerOpertion);
  }
  /**　　* 发送fetch请求
   * @param fetchUrl
   * @param fetchParams
   * @returns {Promise}
   */
  static handleFetchData(fetchUrl, fetchParams, httpCustomerOpertion) {
    // 1. 处理的第一步
    const { isShowLoading } = httpCustomerOpertion;
    if (isShowLoading) {
      HttpUtil.showLoading();
    }
    httpCustomerOpertion.isFetched = false;
    httpCustomerOpertion.isAbort = false;
    // 处理自定义的请求头
    if (httpCustomerOpertion.hasOwnProperty("customHeader")) {
      const { customHeader } = httpCustomerOpertion;
      fetchParams.headers = Object.assign(
        {},
        fetchParams.headers,
        customHeader
      );
    } // 2. 对fetch请求再进行一次Promise的封装
    const fetchPromise = new Promise((resolve, reject) => {
      let requestUrl = this.baseURL + fetchUrl;
      fetch(requestUrl, fetchParams)
        .then((response) => {
          // 3. 放弃迟到的响应
          if (httpCustomerOpertion.isAbort) {
            // 3. 请求超时后，放弃迟到的响应
            return;
          }
          if (isShowLoading) {
            HttpUtil.hideLoading();
          }
          httpCustomerOpertion.isFetched = true;
          response
            .json()
            .then((jsonBody) => {
              if (response.ok) {
                // 4. 统一处理返回结果
                if (jsonBody.status === 5) {
                  // token失效,重新登录
                  CommonTool.turnToLogin();
                } else if (jsonBody.status) {
                  // 业务逻辑报错, 不属于接口报错的范畴
                  reject(
                    HttpUtil.handleFailedResult(jsonBody, httpCustomerOpertion)
                  );
                } else {
                  resolve(
                    HttpUtil.handleResult(jsonBody, httpCustomerOpertion)
                  );
                }
              } else {
                // 5. 接口状态判断
                // http status header <200 || >299
                let msg = "当前服务繁忙，请稍后再试";
                if (response.status === 404) {
                  msg = "您访问的内容走丢了…";
                }
                message.error(msg, 2);
                reject(
                  HttpUtil.handleFailedResult(
                    {
                      fetchStatus: "error",
                      netStatus: response.status,
                      error: msg,
                    },
                    httpCustomerOpertion
                  )
                );
              }
            })
            .catch((e) => {
              const errMsg = e.name + " " + e.message;
              reject(
                HttpUtil.handleFailedResult(
                  {
                    fetchStatus: "error",
                    error: errMsg,
                    netStatus: response.status,
                  },
                  httpCustomerOpertion
                )
              );
            });
        })
        .catch((e) => {
          const errMsg = e.name + " " + e.message;
          // console.error('ERR:', requestUrl, errMsg)
          if (httpCustomerOpertion.isAbort) {
            // 请求超时后，放弃迟到的响应
            return;
          }
          if (isShowLoading) {
            HttpUtil.hideLoading();
          }
          httpCustomerOpertion.isFetched = true;
          httpCustomerOpertion.isHandleResult &&
          message.error(msg, 2);

          reject(
            HttpUtil.handleFailedResult(
              { fetchStatus: "error", error: errMsg },
              httpCustomerOpertion
            )
          );
        });
    });
    return Promise.race([
      fetchPromise,
      HttpUtil.fetchTimeout(httpCustomerOpertion),
    ]);
  }
  /**
   * 统一处理后台返回的结果, 包括业务逻辑报错的结果
   * @param result
   * ps: 通过 this.isHandleError 来判断是否需要有fetch方法来统一处理错误信息
   */
  static handleResult(result, httpCustomerOpertion) {
    if (result.status && httpCustomerOpertion.isHandleResult === true) {
      const errMsg =
        result.msg || result.message || "服务器开小差了，稍后再试吧";
      const errStr = `${errMsg}（${result.status}）`;
      HttpUtil.hideLoading();
      message.error(msg, 2);

    }
    return result;
  }
  /**
   * 统一处fetch的异常, 不包括业务逻辑报错
   * @param result
   * ps: 通过 this.isHandleError 来判断是否需要有fetch方法来统一处理错误信息
   */
  static handleFailedResult(result, httpCustomerOpertion) {
    if (result.status && httpCustomerOpertion.isHandleResult === true) {
      const errMsg =
        result.msg || result.message || "服务器开小差了，稍后再试吧";
      const errStr = `${errMsg}（${result.status}）`;
      HttpUtil.hideLoading();
      Toast.info(errStr, 2);
    }
    const errorMsg =
      "Uncaught PromiseError: " +
      (result.netStatus || "") +
      " " +
      (result.error || result.msg || result.message || "");
    return errorMsg;
  }
  /**
   * 控制Fetch请求是否超时
   * @returns {Promise}
   */
  static fetchTimeout(httpCustomerOpertion) {
    const { isShowLoading } = httpCustomerOpertion;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!httpCustomerOpertion.isFetched) {
          // 还未收到响应，则开始超时逻辑，并标记fetch需要放弃
          httpCustomerOpertion.isAbort = true;
          // console.error('ERR: 请求超时')
          if (isShowLoading) {
            HttpUtil.hideLoading();
          }
          Toast.info("网络开小差了，稍后再试吧", 2);
          reject({ fetchStatus: "timeout" });
        }
      }, httpCustomerOpertion.timeout || timeout);
    });
  }
}
const request = new HttpUtil({
  baseURL: process.env.VUE_APP_API,
  withBaseURL: true,
});
