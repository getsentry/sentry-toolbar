import {forwardRef} from 'react';
import SVGIconBase from 'toolbar/components/icon/SVGIconBase';
import type {SVGIconProps} from 'toolbar/components/icon/SVGIconBase';

const IconGrabbable = forwardRef<SVGSVGElement, SVGIconProps>(function IconGrabbable(props, ref) {
  return (
    <SVGIconBase {...props} ref={ref}>
      <circle cx="4.73" cy="8" r="1.31" />
      <circle cx="4.73" cy="1.31" r="1.31" />
      <circle cx="11.27" cy="8" r="1.31" />
      <circle cx="11.27" cy="1.31" r="1.31" />
      <circle cx="4.73" cy="14.69" r="1.31" />
      <circle cx="11.27" cy="14.69" r="1.31" />
    </SVGIconBase>
  );
});

export default IconGrabbable;
