// promise形式的 getSetting
export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            }
        });
    })
}
// promise形式的 chooseAddress
export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            }
        });
    })
}
// promise形式的 openSetting
export const openSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            }
        });
    })
}

/**
 * promise形式的 showModal
 * @param {object} param0 参数
 * @returns 
 */
export const showModal=({content})=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '提示',
            content: content,
            success: (res)=> {
              resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
          })
    })
}

/**
 * promise形式的 showToast
 * @param {object} param0 参数
 * @returns 
 */
 export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title: title,
            icon: 'none',
            success: (res)=> {
              resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
          })
    })
}

/**
 * promise形式的 login
 * @returns 
 */
export const login=()=>{
    return new Promise((resolve,reject)=>{
        wx.login({
            timeout:10000,
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err)
            }
        });
    })
}