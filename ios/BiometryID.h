//
//  BiometryID.h
//  performance_app
//
//  Created by Peter on 2022/6/23.
//

#ifndef BiometryID_h
#define BiometryID_h

#import <React/RCTBridgeModule.h>
#import <LocalAuthentication/LocalAuthentication.h>

@interface BiometryID : NSObject <RCTBridgeModule>
    - (NSString *_Nonnull)getBiometryType:(LAContext *_Nonnull)context;
@end

#endif /* BiometryID_h */
