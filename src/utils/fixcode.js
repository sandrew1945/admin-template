const codeData = { data: [
  { fixcodeId: 10011001, type: '1001', typeName: '状态', codeDesc: '有效' },
  { fixcodeId: 10011002, type: '1001', typeName: '状态', codeDesc: '无效' },
  { fixcodeId: 10021001, type: '1002', typeName: '性别', codeDesc: '男' },
  { fixcodeId: 10021002, type: '1002', typeName: '性别', codeDesc: '女' },
  { fixcodeId: 10021003, type: '1002', typeName: '性别', codeDesc: '未知' },
  { fixcodeId: 10031001, type: '1003', typeName: '是否', codeDesc: '是' },
  { fixcodeId: 10031002, type: '1003', typeName: '是否', codeDesc: '否' },
  { fixcodeId: 10041001, type: '1004', typeName: '访问类型', codeDesc: '登录' },
  { fixcodeId: 10041002, type: '1004', typeName: '访问类型', codeDesc: '登出' }
] }

/**
 *  获取fixcode描述
 * @param {*} fixcodeId
 */
export function getfixCodeDesc(fixcodeId) {
  if (fixcodeId != null && fixcodeId !== '') {
    const allCode = codeData.data
    let result = ''
    allCode.some((item, index) => {
      if (typeof (fixcodeId) === 'string') {
        fixcodeId = parseInt(fixcodeId)
      }
      if (fixcodeId === allCode[index].fixcodeId) {
        result = allCode[index].codeDesc
        return true
      }
    })
    return result
  } else {
    return ''
  }
}

/**
 *  根据fixcode类型获取全部fixcode
 * @param {*} type
 */
export function getSelectOption(type) {
  const allCode = codeData.data
  const options = []
  allCode.forEach((item, index) => {
    if (allCode[index].type === type) {
      options.push({ key: item.fixcodeId, value: item.codeDesc })
    }
  })
  return options
}
