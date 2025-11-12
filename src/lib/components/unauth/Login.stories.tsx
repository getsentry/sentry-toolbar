import type {Meta, StoryObj} from '@storybook/react';
import {MainArea} from 'toolbar/components/layouts/EdgeLayout';
import Login from 'toolbar/components/unauth/Login';

const meta = {
  title: 'components/unauth/Login',
  component: Login,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    theme: 'light',
    config: {
      theme: 'light',
    },
  },
} as Meta<typeof Login>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = () => {
  return (
    <MainArea>
      <Login />
    </MainArea>
  );
};

export const Default = Template.bind<Story['parameters']>({});
