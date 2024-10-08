import {forwardRef, Fragment} from 'react';
import type {SVGIconProps} from 'toolbar/components/icon/SVGIconBase';
import SVGIconBase from 'toolbar/components/icon/SVGIconBase';

interface Props extends SVGIconProps {
  isSolid?: boolean;
}

const IconPin = forwardRef<SVGSVGElement, Props>(function IconPin({isSolid = false, ...props}: Props, ref) {
  return (
    <SVGIconBase {...props} ref={ref}>
      {isSolid ? (
        <Fragment>
          <path d="M9.48,14.24A.71.71,0,0,1,9,14L5.49,10.55,2.36,7.45,2,7.13a.74.74,0,0,1,0-1l.29-.33c1-1.09,2.49-1.5,4.55-1.22L9.64.79a.76.76,0,0,1,.55-.31.78.78,0,0,1,.58.22l4.52,4.54a.7.7,0,0,1,.22.58.72.72,0,0,1-.3.55L11.46,9.15c.3,2.14-.08,3.65-1.15,4.61l-.34.29A.72.72,0,0,1,9.48,14.24Z" />
          <path d="M.9,15.89a.79.79,0,0,1-.53-.22.75.75,0,0,1,0-1.06l4.89-4.9a.77.77,0,0,1,1.07,0,.75.75,0,0,1,0,1.06l-4.9,4.9A.79.79,0,0,1,.9,15.89Z" />
        </Fragment>
      ) : (
        <Fragment>
          <path d="M9.48,14.24A.71.71,0,0,1,9,14L5.49,10.55,2.36,7.45,2,7.13a.74.74,0,0,1,0-1l.29-.33c1-1.09,2.49-1.5,4.55-1.22L9.64.79a.76.76,0,0,1,.55-.31.78.78,0,0,1,.58.22l4.52,4.54a.7.7,0,0,1,.22.58.72.72,0,0,1-.3.55L11.46,9.15c.3,2.14-.08,3.65-1.15,4.61l-.34.29A.72.72,0,0,1,9.48,14.24ZM3.62,6.59C4,7,5,8,6.54,9.49l3,3c.59-.68.72-1.81.42-3.5a.74.74,0,0,1,.29-.73l3.42-2.53-3.3-3.31L7.8,5.81a.78.78,0,0,1-.73.3C5.47,5.82,4.31,6,3.62,6.59Z" />
          <path d="M.9,15.89a.79.79,0,0,1-.53-.22.75.75,0,0,1,0-1.06l4.89-4.9a.77.77,0,0,1,1.07,0,.75.75,0,0,1,0,1.06l-4.9,4.9A.79.79,0,0,1,.9,15.89Z" />
        </Fragment>
      )}
    </SVGIconBase>
  );
});

IconPin.displayName = '';

export default IconPin;
