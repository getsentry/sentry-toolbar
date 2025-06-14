import type {Meta, StoryObj} from '@storybook/react';
import Navigation from 'toolbar/components/Navigation';

const meta = {
  title: 'components/Navigation',
  component: Navigation,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  args: {
    placement: 'right-edge',
  },
} as Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightTheme: Story = {
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

export const DarkTheme: Story = {
  parameters: {
    theme: 'dark',
    storage: {
      useNavigationExpansion_isPinned: false,
    },
    config: {
      theme: 'dark',
    },
  },
};

export const LightPinnedTheme: Story = {
  parameters: {
    theme: 'light',
    storage: {
      useNavigationExpansion_isPinned: true,
    },
    config: {
      theme: 'light',
    },
  },
};

export const DarkPinnedTheme: Story = {
  parameters: {
    theme: 'dark',
    storage: {
      useNavigationExpansion_isPinned: true,
    },
    config: {
      theme: 'dark',
    },
  },
};
