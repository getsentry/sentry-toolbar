import {forwardRef} from 'react';
import SVGIconBase from 'toolbar/components/icon/SVGIconBase';
import type {SVGIconProps} from 'toolbar/components/icon/SVGIconBase';

const IconLogs = forwardRef<SVGSVGElement, SVGIconProps>(function IconLogs(props, ref) {
  return (
    <SVGIconBase {...props} ref={ref}>
      <path d="M2 3h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm0 1v8h12V4H2z"/>
      <path d="M3 6h6v1H3V6zm0 2h8v1H3V8zm0 2h4v1H3v-1z"/>
    </SVGIconBase>
  );
});

export default IconLogs;
