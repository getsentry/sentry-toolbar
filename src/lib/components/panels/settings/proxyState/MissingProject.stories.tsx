import type {Meta, StoryObj} from '@storybook/react-vite';
import MissingProject from 'toolbar/components/panels/settings/proxyState/MissingProject';

const meta = {
  title: 'components/unauth/MissingProject',
  component: MissingProject,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
} as Meta<typeof MissingProject>;

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
