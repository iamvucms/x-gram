import i18n from '@/Translations/i18n'

const translation = i18n.t

export function validateUserName(value) {
  const regexSpecialString =
    /[!@#$%^&*()+\- =\[\]{};':"\\|,.<>\/?ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+/
  if (value.trim().length === 0) {
    return translation('authPage.errorRequireUserName')
  } else if (value.trim().length < 6) {
    return translation('authPage.errorRequireUserNameMin6')
  } else if (value.trim().length >= 30) {
    return translation('authPage.errorRequireUserNameMax30')
  } else if (regexSpecialString.test(value.trim())) {
    return translation('authPage.errorRequireUserNameNotContainSpecial')
  } else {
    return ''
  }
}

export function validateUserPass(value) {
  const regexSpecialString =
    /^(?=.*\d)(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*()+=-?;,./{}|":<>[\]\\'-~_]{8,}$/
  if (value.trim().length === 0) {
    return translation('authPage.errorRequirePass')
  } else if (value.trim().length < 8) {
    return translation('authPage.errorRequireUserPassMin8')
  } else if (!regexSpecialString.test(value.trim())) {
    return translation('authPage.errorRequireUppercaseAndNumber')
  } else {
    return ''
  }
}

export function validateUserPassSimple(value) {
  if (value.trim().length === 0) {
    return translation('authPage.errorRequirePass')
  } else if (value.trim().length < 6) {
    return translation('authPage.errorRequireUserPassMin6')
  } else {
    return ''
  }
}

export function validateUserOldPass(value, oldPass) {
  if (oldPass.trim() !== value.trim()) {
    return translation('authPage.notSameOldPass')
  } else {
    return ''
  }
}

export function validateConfirmPass(pass, confirmPass) {
  if (confirmPass.trim().length === 0) {
    return translation('authPage.errorRequirePass')
  } else if (confirmPass.trim().length < 6) {
    return translation('authPage.errorRequireUserPassMin6')
  } else if (confirmPass.trim() !== pass.trim()) {
    return translation('authPage.notSamePass')
  } else {
    return ''
  }
}

export function validateUserPhone(value) {
  const regexDisplayString =
    /[ !@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+/
  if (value.trim().length === 0) {
    return translation('authPage.errorRequirePhone')
  } else if (value.trim().length < 10) {
    return translation('authPage.errorRequireUserPhoneMin10')
  } else if (value.trim().charAt(0) !== '0') {
    return translation('authPage.errorRequireUserPhoneStart0')
  } else if (regexDisplayString.test(value.trim())) {
    return translation('authPage.errorRequireUserPhoneSymbol')
  } else {
    return ''
  }
}

export function validateEmail(value) {
  const regExp = /^[+._\-\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  if (!regExp.test(value)) {
    return translation('auth.email_error')
  }
  return ''
}

export function validateFullName(value) {
  const regexDisplayString =
    /[ !@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+/
  if (value.trim().length === 0) {
    return translation('account.requireDisplayName')
  } else if (value.trim().length < 6) {
    return translation('account.requireLengthDisplayName')
  } else if (regexDisplayString.test(value.trim())) {
    return translation('account.errorRequireNameNotContainSpecial')
  } else {
    return ''
  }
}

export function validateWithdrawMoney(value) {
  if (value.trim().length === 0) {
    return translation('withdrawBank.errorMoneyEmpty')
  } else if (value.trim() < 100) {
    return translation('withdrawBank.errorMoneyMin')
  } else if (value.trim() > 1000000) {
    return translation('withdrawBank.errorMoneyMax')
  } else {
    return ''
  }
}

export function removeSpecialCharAccountNumber(value) {
  return value != null ? value.replace(/[^0-9 ]/g, '') : ''
}

export function replaceSpecialCharacters(value) {
  return value != null ? value.replace(/[^a-zA-Z ]/g, '') : ''
}

export const hideFirstCharAccountName = accountName => {
  const splits = accountName.split(' ')
  const lastName = splits[splits.length - 1]
  let hideChar = ''
  for (let i = 0; i <= splits.length - 2; i++) {
    hideChar = hideChar + Array(splits[i].length + 1).join('*') + ' '
  }
  return `${hideChar}${lastName}`
}

export const showLastCharAccountNumber = accountNumber => {
  if (accountNumber.length > 4) {
    const lastAccountNumber = accountNumber.substring(
      accountNumber.length - 4,
      accountNumber.length,
    )
    return Array(accountNumber.length - 4).join('*') + lastAccountNumber
  }
  return accountNumber
}
export const hideCharPhoneNumber = (phoneNumber, isHide = false) => {
  if (!isHide) {
    return phoneNumber
  }
  if (phoneNumber?.length > 9) {
    const firstPhoneNumber = phoneNumber.substring(0, phoneNumber.length - 3)
    const lastPhoneNumber = phoneNumber.substring(
      phoneNumber.length - 4,
      phoneNumber.length,
    )
    return firstPhoneNumber + Array(lastPhoneNumber.length).join('*')
  }
}
export const hideCharEmail = (email, isHide = false) => {
  if (!isHide) {
    return email
  }
  if (email?.trim().length > 0) {
    const splits = email.split('@')
    const firstChar = email.substring(0, splits[0].length)
    return Array(firstChar.length + 1).join('*') + '@' + splits[1]
  }
}
