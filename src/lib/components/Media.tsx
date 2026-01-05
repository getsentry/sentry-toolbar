import {cva, cx} from 'cva';
import type {ReactNode} from 'react';

const containerClassName = cva('flex items-center', {
  variants: {
    size: {
      sm: 'gap-0.75',
      md: 'gap-1',
      lg: 'gap-1.5',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const mediaClassName = cva('flex shrink-0 items-center justify-center', {
  variants: {
    size: {
      sm: 'size-2',
      md: 'size-3',
      lg: 'size-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const titleClassName = cva('truncate font-medium', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const descriptionClassName = cva('truncate text-gray-300', {
  variants: {
    size: {
      sm: 'text-[10px]',
      md: 'text-xs',
      lg: 'text-sm',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface Props {
  /**
   * Content rendered in the square left section (icon, avatar, image, etc.)
   */
  media: ReactNode;
  /**
   * Primary text shown in the first row
   */
  title: ReactNode;
  /**
   * Secondary text shown in the second row
   */
  description?: ReactNode;
  /**
   * Size variant affecting spacing and typography
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Additional className applied to the container
   */
  className?: string;
}

export default function Media({media, title, description, size = 'md', className}: Props) {
  return (
    <div className={cx(containerClassName({size}), className)}>
      <div className={mediaClassName({size})}>{media}</div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.25">
        <div className={titleClassName({size})}>{title}</div>
        {description !== undefined && <div className={descriptionClassName({size})}>{description}</div>}
      </div>
    </div>
  );
}
