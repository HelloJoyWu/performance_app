import React, {createContext, useState} from 'react';

const NotifyContext = createContext({} as notifyContextType);
const {Provider} = NotifyContext;

const NotifyProvider: React.FC<notifyContextType> = ({children}) => {
  const [isNotify, setIsNotify] = useState<string>('');
  return (
    <Provider
      value={{
        isNotify,
        setIsNotify,
      }}>
      {children}
    </Provider>
  );
};

export {NotifyContext, NotifyProvider};
