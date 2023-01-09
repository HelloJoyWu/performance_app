type notifyContextType = {
  isNotify: string;
  setIsNotify: (messageId: string) => void;
};

interface notifyAlarmMsg {
  msgid: string;
  action: string;
  title: string;
  message: string;
  brand: string;
  date: string;
}

interface authTokenInterface {
  [backendURL: string]: {accessToken: string; refreshToken: string};
}

interface authInfoInterface {
  username: string;
  lastName: string;
  groups: Array;
  email: string;
}

type authContextType = {
  authToken: authTokenInterface;
  authInfo: authInfoInterface;
  authState: boolean;
  setAuthState: (authStatus: boolean) => void;
  isLoading: boolean;
  setIsLoading: (lodingOrNot: boolean) => void;
  logout: () => void;
  storeAuthToken: (tokenInfo: authTokenInterface) => void;
  storeAuthInfo: (insertAuthInfo: authInfoInterface) => void;
  showExtensionTime: boolean;
  setShowExtensionTime: (displayStatus: boolean) => void;
  loginTime: number;
  setLoginTime: (time: number) => void;
  timeDelayAgain: boolean;
  setTimeDelayAgain: (displayStatus: boolean) => void;
};

type RootStackParamList = {
  MenuScreen: undefined;
  MainMenuScreen: undefined;
  DockingAreaScreen: undefined;
  MarketMenuScreen: undefined;
  SettingScreen: undefined;
  LoginScreen: undefined;
  RulerScreen: undefined;
  CallScreen: undefined;
  MessagePushScreen: undefined;
  QuickSearchScreen: undefined;
  Cq9Screen: {keyProps: any};
  ChamplandScreen: {keyProps: any};
  KimbabaScreen: {keyProps: any};
  LegoScreen: {keyProps: any};
  MotivationScreen: {keyProps: any};
  GensportsScreen: {keyProps: any};
  AverageDailyBetScreen: undefined;
  AverageDailyPlayerScreen: undefined;
  OverviewGameTypesScreen: undefined;
  CQ9AllAccBetScreenScreen: undefind;
  GroupComparisonScreen: undefined;
  SpinnerScreen: undefined;
  ChangePasswordScreen: undefined;
  ChangeNameScreen: undefined;
};
