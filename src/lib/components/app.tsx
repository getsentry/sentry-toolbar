import {useContext} from 'react';
import LoginButton from 'toolbar/components/unauth/LoginButton';
import {AuthContext} from 'toolbar/context/AuthContext';

export default function App() {
  const [{accessToken}] = useContext(AuthContext);

  return accessToken ? (
    <div>Token = {accessToken}</div>
  ) : (
    <div>
      <LoginButton />
    </div>
  );
}
