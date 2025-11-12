import type {Meta, StoryObj} from '@storybook/react';
import {MainArea} from 'toolbar/components/layouts/EdgeLayout';
import Connecting from 'toolbar/components/unauth/Connecting';

const meta = {
  title: 'components/unauth/Connecting',
  component: Connecting,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    theme: 'light',
    config: {
      theme: 'light',
    },
  },
} as Meta<typeof Connecting>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = () => {
  return (
    <MainArea>
      <Connecting />
    </MainArea>
  );
};

export const Default = Template.bind<Story['parameters']>({});
