export const codes = {
  iOSCodes: {
    LAErrorAuthenticationFailed: 'LAErrorAuthenticationFailed',
    LAErrorUserCancel: 'LAErrorUserCancel',
    LAErrorUserFallback: 'LAErrorUserFallback',
    LAErrorSystemCancel: 'LAErrorSystemCancel',
    LAErrorPasscodeNotSet: 'LAErrorPasscodeNotSet',
    LAErrorBiometryIDNotAvailable: 'LAErrorBiometryIDNotAvailable',
    LAErrorBiometryIDNotEnrolled: 'LAErrorBiometryIDNotEnrolled',
    LAErrorBiometryIDLockout: 'LAErrorBiometryIDLockout',
    RCTBiometryIDNotSupported: 'RCTBiometryIDNotSupported',
  },
  androidApiCodes: {
    ERROR_HW_UNAVAILABLE: 'ERROR_HW_UNAVAILABLE',
    ERROR_UNABLE_TO_PROCESS: 'ERROR_UNABLE_TO_PROCESS',
    ERROR_TIMEOUT: 'ERROR_TIMEOUT',
    ERROR_NO_SPACE: 'ERROR_NO_SPACE',
    ERROR_CANCELED: 'ERROR_CANCELED',
    ERROR_LOCKOUT: 'ERROR_LOCKOUT',
    ERROR_SECURITY_UPDATE_REQUIRED: 'ERROR_SECURITY_UPDATE_REQUIRED',
    ERROR_LOCKOUT_PERMANENT: 'ERROR_LOCKOUT_PERMANENT',
    ERROR_USER_CANCELED: 'ERROR_USER_CANCELED',
    ERROR_NO_BIOMETRICS: 'ERROR_NO_BIOMETRICS',
    ERROR_HW_NOT_PRESENT: 'ERROR_HW_NOT_PRESENT',
    ERROR_NEGATIVE_BUTTON: 'ERROR_NEGATIVE_BUTTON',
    ERROR_NO_DEVICE_CREDENTIAL: 'ERROR_NO_DEVICE_CREDENTIAL',
    ERROR_VENDOR: 'ERROR_VENDOR',
  },
  androidModuleCodes: {
    BIOMETRIC_STATUS_UNKNOWN: 'BIOMETRIC_STATUS_UNKNOWN',
    BIOMETRIC_ERROR_UNSUPPORTED: 'BIOMETRIC_ERROR_UNSUPPORTED',
    BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED:
      'BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED',
    BIOMETRIC_ERROR_NO_HARDWARE: 'BIOMETRIC_ERROR_NO_HARDWARE',
    BIOMETRIC_ERROR_NONE_ENROLLED: 'BIOMETRIC_ERROR_NONE_ENROLLED',
    BIOMETRIC_ERROR_HW_UNAVAILABLE: 'BIOMETRIC_ERROR_HW_UNAVAILABLE',
  },
};

export const iOSErrors = {
  [codes.iOSCodes.LAErrorAuthenticationFailed]: {
    message:
      'Authentication was not successful because the user failed to provide valid credentials.',
  },
  [codes.iOSCodes.LAErrorUserCancel]: {
    message:
      'Authentication was canceled by the user—for example, the user tapped Cancel in the dialog.',
  },
  [codes.iOSCodes.LAErrorUserFallback]: {
    message:
      'Authentication was canceled because the user tapped the fallback button (Enter Password).',
  },
  [codes.iOSCodes.LAErrorSystemCancel]: {
    message:
      'Authentication was canceled by system—for example, if another application came to foreground while the authentication dialog was up.',
  },
  [codes.iOSCodes.LAErrorPasscodeNotSet]: {
    message:
      'Authentication could not start because the passcode is not set on the device.',
  },
  [codes.iOSCodes.LAErrorBiometryIDNotAvailable]: {
    message:
      'Authentication could not start because Biometry ID is not available on the device',
  },
  [codes.iOSCodes.LAErrorBiometryIDNotEnrolled]: {
    message:
      'Authentication could not start because Biometry ID has no enrolled fingers.',
  },
  [codes.iOSCodes.LAErrorBiometryIDLockout]: {
    message: 'Authentication failed because of too many failed attempts.',
  },
  [codes.iOSCodes.RCTBiometryIDNotSupported]: {
    message: 'Device does not support Biometry ID.',
  },
};

export const androidApiErrorMap = {
  '1': codes.androidApiCodes.ERROR_HW_UNAVAILABLE,
  '2': codes.androidApiCodes.ERROR_UNABLE_TO_PROCESS,
  '3': codes.androidApiCodes.ERROR_TIMEOUT,
  '4': codes.androidApiCodes.ERROR_NO_SPACE,
  '5': codes.androidApiCodes.ERROR_CANCELED,
  '7': codes.androidApiCodes.ERROR_LOCKOUT,
  '8': codes.androidApiCodes.ERROR_VENDOR,
  '9': codes.androidApiCodes.ERROR_LOCKOUT_PERMANENT,
  '10': codes.androidApiCodes.ERROR_USER_CANCELED,
  '11': codes.androidApiCodes.ERROR_NO_BIOMETRICS,
  '12': codes.androidApiCodes.ERROR_HW_NOT_PRESENT,
  '13': codes.androidApiCodes.ERROR_NEGATIVE_BUTTON,
  '14': codes.androidApiCodes.ERROR_NO_DEVICE_CREDENTIAL,
  '15': codes.androidApiCodes.ERROR_SECURITY_UPDATE_REQUIRED,
};

export const androidModuleErrorMap = {
  '-1': codes.androidModuleCodes.BIOMETRIC_STATUS_UNKNOWN,
  '-2': codes.androidModuleCodes.BIOMETRIC_ERROR_UNSUPPORTED,
  '1': codes.androidModuleCodes.BIOMETRIC_ERROR_HW_UNAVAILABLE,
  '11': codes.androidModuleCodes.BIOMETRIC_ERROR_NONE_ENROLLED,
  '12': codes.androidModuleCodes.BIOMETRIC_ERROR_NO_HARDWARE,
  '15': codes.androidModuleCodes.BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED,
};

export const errors = {
  AUTHENTICATION_FAILED: {
    message: 'Authentication failed',
    code: 'AUTHENTICATION_FAILED',
  },
  USER_CANCELED: {
    message: 'User canceled authentication',
    code: 'USER_CANCELED',
  },
  SYSTEM_CANCELED: {
    message: 'System canceled authentication',
    code: 'SYSTEM_CANCELED',
  },
  NOT_PRESENT: {
    message: 'Biometry hardware not present',
    code: 'NOT_PRESENT',
  },
  NOT_SUPPORTED: {
    message: 'Biometry is not supported',
    code: 'NOT_SUPPORTED',
  },
  NOT_AVAILABLE: {
    message: 'Biometry is not currently available',
    code: 'NOT_AVAILABLE',
  },
  NOT_ENROLLED: {
    message: 'Biometry is not enrolled',
    code: 'NOT_ENROLLED',
  },
  TIMEOUT: {
    message: 'Biometry timeout',
    code: 'TIMEOUT',
  },
  LOCKOUT: {
    message: 'Biometry lockout',
    code: 'LOCKOUT',
  },
  LOCKOUT_PERMANENT: {
    message: 'Biometry permanent lockout',
    code: 'LOCKOUT_PERMANENT',
  },
  PROCESSING_ERROR: {
    message: 'Biometry processing error',
    code: 'PROCESSING_ERROR',
  },
  USER_FALLBACK: {
    message: 'User selected fallback',
    code: 'USER_FALLBACK',
  },
  FALLBACK_NOT_ENROLLED: {
    message: 'User selected fallback not enrolled',
    code: 'FALLBACK_NOT_ENROLLED',
  },
  UNKNOWN_ERROR: {
    message: 'Unknown error',
    code: 'UNKNOWN_ERROR',
  },
};
