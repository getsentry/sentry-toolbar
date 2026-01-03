import type {Meta, StoryObj} from '@storybook/react-vite';
import Placeholder from 'toolbar/components/base/Placeholder';

const meta: Meta<typeof Placeholder> = {
  title: 'components/base/Placeholder',
  component: Placeholder,
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
type Story = StoryObj<typeof Placeholder>;

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
        <Placeholder shape="round" className="size-[40px]" />
        <div className="flex flex-1 flex-col gap-1">
          <Placeholder height="text" className="w-3/5" />
          <Placeholder height="text" className="w-2/5" />
        </div>
      </div>
      <Placeholder height="small" width="full" />
      <Placeholder height="text" width="full" />
      <Placeholder height="text" className="w-4/5" />
    </div>
  ),
};
