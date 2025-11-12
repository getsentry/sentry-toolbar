import type {Meta, StoryObj} from '@storybook/react';
import {MainArea} from 'toolbar/components/layouts/EdgeLayout';
import Disconnected from 'toolbar/components/unauth/Disconnected';

const meta = {
  title: 'components/unauth/Disconnected',
  component: Disconnected,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    theme: 'light',
    config: {
      theme: 'light',
    },
  },
} as Meta<typeof Disconnected>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = () => {
  return (
    <MainArea>
      <Disconnected />
    </MainArea>
  );
};

export const Default = Template.bind<Story['parameters']>({});
