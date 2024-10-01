import type {Meta, StoryObj} from '@storybook/react';
import Loading from 'toolbar/components/Loading';

const meta: Meta<typeof Loading> = {
  title: 'Components/Loading',
  component: Loading,
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
type Story = StoryObj<typeof Loading>;

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
    children: 'Loading...',
  },
};
