import {Component} from 'react';
import {NativeModules, Platform} from 'react-native';
import * as biometryError from './biometryError';
const NativeBiometryID = NativeModules.BiometryID;

/**
 * High-level docs for the TouchID iOS API can be written here.
 */

export default class BiometryID extends Component {
  static isSupported(config?: object | undefined): Promise<string> {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'ios') {
        NativeBiometryID.isSupported(
          config ? config : {},
          (error: any, biometryType: string) => {
            console.log('NativeBiometryID isSupported', error, biometryType);
            if (error) {
              return reject(createError(error.message, config));
            }
            return resolve(biometryType);
          },
        );
      } else if (Platform.OS === 'android') {
        NativeBiometryID.isSupported(
          (error: string, code: string) => {
            const errorCode =
              // @ts-ignore
              biometryError.androidApiErrorMap[code] ||
              // @ts-ignore
              biometryError.androidModuleErrorMap[code];
            console.error(
              'NativeBiometryID isSupported',
              error,
              code,
              errorCode,
            );
            return reject(createError(errorCode, config));
          },
          (biometryType: string) => {
            return resolve(biometryType);
          },
        );
      } else {
        return reject('Platform not supportted');
      }
    });
  }

  static authenticate(
    reason: string,
    config?: object | undefined,
  ): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const DEFAULT_CONFIG = {
        fallbackLabel: null,
        unifiedErrors: false,
        passcodeFallback: false,
      };
      const authReason = reason ? reason : ' ';
      const authConfig = Object.assign({}, DEFAULT_CONFIG, config);

      return new Promise((resolve, reject) => {
        NativeBiometryID.authenticate(authReason, authConfig, (error: any) => {
          // Return error if rejected
          if (error) {
            return reject(createError(error.message, authConfig));
          }
          return resolve(true);
        });
      });
    } else if (Platform.OS === 'android') {
      var authReason = reason ? reason : ' ';

      return new Promise((resolve, reject) => {
        NativeBiometryID.authenticate(
          authReason,
          (error: string, code: string) => {
            const errorCode =
              // @ts-ignore
              biometryError.androidApiErrorMap[code] ||
              // @ts-ignore
              biometryError.androidModuleErrorMap[code];
            console.error('NativeBiometryID authenticate', code, error);
            return reject(createError(errorCode));
          },
          (success: any) => {
            return resolve(true);
          },
        );
      });
    } else {
      return new Promise((_, reject) => {
        reject('Platform not supportted');
      });
    }
  }
}

// const BiometryID = new biometryID();
// export default BiometryID;

export class BiometryIDError extends Error {
  details: {[message: string]: string};
  code: string;
  constructor(details: {[message: string]: string}, code: string) {
    super();
    this.name = 'BiometryIDError';
    this.message = details.message || 'Biometry ID Error';
    this.details = details || {};
    this.code = code;
  }
}

const createError = (error: string, config?: object) => {
  const details = {
    name: error,
    message: getError(error).message,
    config: config ? JSON.stringify(config) : 'Not set',
  };

  return new BiometryIDError(details, error);
};

const getError = (code: any) => {
  switch (code) {
    case biometryError.codes.iOSCodes.LAErrorAuthenticationFailed:
    case biometryError.codes.androidModuleCodes.BIOMETRIC_ERROR_NONE_ENROLLED:
      return biometryError.errors.AUTHENTICATION_FAILED;

    case biometryError.codes.iOSCodes.LAErrorUserCancel:
    case biometryError.codes.androidApiCodes.ERROR_USER_CANCELED:
    case biometryError.codes.androidModuleCodes.BIOMETRIC_ERROR_HW_UNAVAILABLE:
      return biometryError.errors.USER_CANCELED;

    case biometryError.codes.iOSCodes.LAErrorSystemCancel:
    case biometryError.codes.androidApiCodes.ERROR_CANCELED:
    case biometryError.codes.androidApiCodes.ERROR_NEGATIVE_BUTTON:
    case biometryError.codes.androidApiCodes.ERROR_VENDOR:
      return biometryError.errors.SYSTEM_CANCELED;

    case biometryError.codes.iOSCodes.LAErrorBiometryIDNotAvailable: // does this mean hw not present rather than not available?
    case biometryError.codes.androidApiCodes.ERROR_HW_UNAVAILABLE:
    case biometryError.codes.androidModuleCodes
      .BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED:
    case biometryError.codes.androidApiCodes.ERROR_NO_DEVICE_CREDENTIAL:
    case biometryError.codes.androidApiCodes.ERROR_SECURITY_UPDATE_REQUIRED:
      return biometryError.errors.NOT_AVAILABLE;

    case biometryError.codes.iOSCodes.RCTBiometryIDNotSupported:
    case biometryError.codes.androidModuleCodes.BIOMETRIC_STATUS_UNKNOWN:
      return biometryError.errors.NOT_SUPPORTED;

    case biometryError.codes.iOSCodes.LAErrorBiometryIDNotEnrolled:
    case biometryError.codes.androidApiCodes.ERROR_NO_BIOMETRICS:
    case biometryError.codes.androidModuleCodes.BIOMETRIC_ERROR_NO_HARDWARE:
      return biometryError.errors.NOT_ENROLLED;

    // android only
    case biometryError.codes.androidApiCodes.ERROR_TIMEOUT:
      return biometryError.errors.TIMEOUT;

    case biometryError.codes.androidApiCodes.ERROR_UNABLE_TO_PROCESS:
    case biometryError.codes.androidApiCodes.ERROR_NO_SPACE:
      return biometryError.errors.PROCESSING_ERROR;

    case biometryError.codes.androidApiCodes.ERROR_LOCKOUT:
      return biometryError.errors.LOCKOUT;

    case biometryError.codes.androidApiCodes.ERROR_LOCKOUT_PERMANENT:
      return biometryError.errors.LOCKOUT_PERMANENT;

    case biometryError.codes.androidApiCodes.ERROR_HW_NOT_PRESENT:
    case biometryError.codes.androidModuleCodes.BIOMETRIC_ERROR_UNSUPPORTED:
      return biometryError.errors.NOT_PRESENT;

    // ios only
    case biometryError.codes.iOSCodes.LAErrorPasscodeNotSet:
      return biometryError.errors.FALLBACK_NOT_ENROLLED;

    case biometryError.codes.iOSCodes.LAErrorUserFallback:
      return biometryError.errors.USER_FALLBACK;

    case biometryError.codes.iOSCodes.LAErrorBiometryIDLockout:
      return biometryError.errors.LOCKOUT;

    default:
      return biometryError.errors.UNKNOWN_ERROR;
  }
};
