import type {Meta, StoryObj} from '@storybook/react-vite';
import type {VariantProps} from 'cva';
import Placeholder from 'toolbar/components/base/Placeholder';

type PlaceholderProps = VariantProps<typeof Placeholder> & {
  children?: React.ReactNode;
};

function PlaceholderDemo({children, ...props}: PlaceholderProps) {
  return <div className={Placeholder(props)}>{children}</div>;
}

const meta: Meta<typeof PlaceholderDemo> = {
  title: 'components/base/Placeholder',
  component: PlaceholderDemo,
  argTypes: {
    height: {
      control: 'select',
      options: ['full', 'auto', 'text', 'small', 'medium'],
    },
    width: {
      control: 'select',
      options: ['full', 'auto'],
    },
    shape: {
      control: 'select',
      options: ['square', 'round'],
    },
    state: {
      control: 'select',
      options: ['normal', 'error'],
    },
    children: {
      control: 'text',
    },
  },
  decorators: [
    Story => (
      <div style={{width: '300px', height: '200px'}}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PlaceholderDemo>;

// Playground with all controls
export const Playground: Story = {
  args: {
    height: 'medium',
    width: 'full',
    shape: 'square',
    state: 'normal',
  },
};

// Height variants
export const HeightText: Story = {
  args: {
    height: 'text',
    width: 'full',
  },
};

export const HeightSmall: Story = {
  args: {
    height: 'small',
    width: 'full',
  },
};

export const HeightMedium: Story = {
  args: {
    height: 'medium',
    width: 'full',
  },
};

export const HeightFull: Story = {
  args: {
    height: 'full',
    width: 'full',
  },
};

export const HeightAuto: Story = {
  args: {
    height: 'auto',
    width: 'full',
    children: 'Content determines height',
  },
};

// Width variants
export const WidthFull: Story = {
  args: {
    height: 'medium',
    width: 'full',
  },
};

export const WidthAuto: Story = {
  args: {
    height: 'medium',
    width: 'auto',
    children: 'Auto width',
  },
};

// Shape variants
export const ShapeSquare: Story = {
  args: {
    height: 'medium',
    width: 'auto',
    shape: 'square',
  },
  decorators: [
    Story => (
      <div style={{width: '100px', height: '100px'}}>
        <Story />
      </div>
    ),
  ],
};

export const ShapeRound: Story = {
  args: {
    height: 'full',
    width: 'auto',
    shape: 'round',
  },
  decorators: [
    Story => (
      <div style={{width: '80px', height: '80px'}}>
        <Story />
      </div>
    ),
  ],
};

// State variants
export const StateNormal: Story = {
  args: {
    height: 'medium',
    width: 'full',
    state: 'normal',
  },
};

export const StateError: Story = {
  args: {
    height: 'medium',
    width: 'full',
    state: 'error',
    children: 'Error state',
  },
};

// Combined examples
export const RoundAvatar: Story = {
  name: 'Avatar Placeholder',
  args: {
    height: 'full',
    width: 'auto',
    shape: 'round',
    state: 'normal',
  },
  decorators: [
    Story => (
      <div style={{width: '48px', height: '48px'}}>
        <Story />
      </div>
    ),
  ],
};

export const TextLinePlaceholder: Story = {
  name: 'Text Line Placeholder',
  args: {
    height: 'text',
    width: 'full',
    shape: 'square',
    state: 'normal',
  },
};

export const CardPlaceholder: Story = {
  name: 'Card Placeholder',
  args: {
    height: 'full',
    width: 'full',
    shape: 'square',
    state: 'normal',
  },
};

export const ErrorCardPlaceholder: Story = {
  name: 'Error Card Placeholder',
  args: {
    height: 'full',
    width: 'full',
    shape: 'square',
    state: 'error',
    children: 'Something went wrong',
  },
};

// Multiple placeholders to simulate a loading skeleton
export const SkeletonExample: Story = {
  name: 'Skeleton Loading Example',
  render: () => (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-3">
        <div className={Placeholder({height: 'full', width: 'auto', shape: 'round'})} style={{width: 40, height: 40}} />
        <div className="flex flex-1 flex-col gap-1">
          <div className={Placeholder({height: 'text', width: 'auto'})} style={{width: '60%'}} />
          <div className={Placeholder({height: 'text', width: 'auto'})} style={{width: '40%'}} />
        </div>
      </div>
      <div className={Placeholder({height: 'small', width: 'full'})} />
      <div className={Placeholder({height: 'text', width: 'full'})} />
      <div className={Placeholder({height: 'text', width: 'auto'})} style={{width: '80%'}} />
    </div>
  ),
};
