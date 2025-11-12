import type {Meta, StoryObj} from '@storybook/react-vite';
import Disconnected from 'toolbar/components/unauth/Disconnected';

const meta = {
  title: 'components/unauth/Disconnected',
  component: Disconnected,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
} as Meta<typeof Disconnected>;

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
