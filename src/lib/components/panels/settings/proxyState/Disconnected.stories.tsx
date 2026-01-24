import type {Meta, StoryObj} from '@storybook/react-vite';
import Disconnected from 'toolbar/components/panels/settings/proxyState/Disconnected';

const meta = {
  title: 'components/panels/settings/proxyState/Disconnected',
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
