import type {Meta, StoryObj} from '@storybook/react-vite';
import LoadingSpinner from 'toolbar/components/LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  argTypes: {
    size: {
      control: 'select',
      options: ['mini', 'normal'],
    },
    children: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {
  args: {
    size: 'normal',
  },
};

export const Mini: Story = {
  args: {
    size: 'mini',
  },
};

export const DarkMode: Story = {
  parameters: {
    theme: 'dark',
  },
  args: {
    size: 'normal',
    children: 'LoadingSpinner...',
  },
};
