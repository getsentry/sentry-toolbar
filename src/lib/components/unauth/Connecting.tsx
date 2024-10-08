import {useContext} from 'react';
import ConfigContext from 'toolbar/context/ConfigContext';

export default function Connecting() {
  const {sentryOrigin} = useContext(ConfigContext);

  return <div>Connecting to {sentryOrigin}...</div>;
}
