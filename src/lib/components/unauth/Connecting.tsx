import {useContext} from 'react';
import UnauthPill from 'toolbar/components/unauth/UnauthPill';
import ConfigContext from 'toolbar/context/ConfigContext';

export default function Connecting() {
  const {sentryOrigin} = useContext(ConfigContext);

  return <UnauthPill>Connecting to {sentryOrigin}...</UnauthPill>;
}
