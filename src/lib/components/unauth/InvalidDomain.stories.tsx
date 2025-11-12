import type {Meta, StoryObj} from '@storybook/react-vite';
import InvalidDomain from 'toolbar/components/unauth/InvalidDomain';

const meta = {
  title: 'components/unauth/InvalidDomain',
  component: InvalidDomain,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
} as Meta<typeof InvalidDomain>;

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
