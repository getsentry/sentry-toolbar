import {cva} from 'cva';

const navGrabber = cva(
  'relative cursor-grab border-transparent after:absolute after:bg-translucentGray-200 after:hover:bg-gray-300',
  {
    variants: {
      isHorizontal: {
        false: ['-my-1 w-full py-1 after:top-1/2 after:h-px after:w-full'],
        true: ['-mx-1 h-[34px] w-px px-1 after:left-1/2 after:h-full after:w-px'],
      },
    },
  }
);

interface Props {
  isHorizontal: boolean;
}

export default function NavGrabber({isHorizontal}: Props) {
  return <hr className={navGrabber({isHorizontal})} data-grabber />;
}
