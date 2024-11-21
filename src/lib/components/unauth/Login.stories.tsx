import type {Meta, StoryObj} from '@storybook/react';
import Login from 'toolbar/components/unauth/Login';

const meta = {
  title: 'components/unauth/Login',
  component: Login,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
} as Meta<typeof Login>;

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
