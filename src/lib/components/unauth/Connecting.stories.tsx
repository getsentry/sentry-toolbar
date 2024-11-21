import type {Meta, StoryObj} from '@storybook/react';
import Connecting from 'toolbar/components/unauth/Connecting';

const meta = {
  title: 'components/unauth/Connecting',
  component: Connecting,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
} as Meta<typeof Connecting>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    theme: 'light',
    storage: {
      useNavigationExpansion_isPinned: false,
    },
    config: {
      theme: 'light',
    },
  },
};
