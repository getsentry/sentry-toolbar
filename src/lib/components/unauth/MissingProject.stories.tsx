import type {Meta, StoryObj} from '@storybook/react';
import {MainArea} from 'toolbar/components/layouts/EdgeLayout';
import MissingProject from 'toolbar/components/unauth/MissingProject';

const meta = {
  title: 'components/unauth/MissingProject',
  component: MissingProject,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    theme: 'light',
    config: {
      theme: 'light',
    },
  },
} as Meta<typeof MissingProject>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = () => {
  return (
    <MainArea>
      <MissingProject />
    </MainArea>
  );
};

export const Default = Template.bind<Story['parameters']>({});
