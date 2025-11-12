import type {Meta, StoryObj} from '@storybook/react';
import {MainArea} from 'toolbar/components/layouts/EdgeLayout';
import InvalidDomain from 'toolbar/components/unauth/InvalidDomain';

const meta = {
  title: 'components/unauth/InvalidDomain',
  component: InvalidDomain,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    theme: 'light',
    config: {
      theme: 'light',
    },
  },
} as Meta<typeof InvalidDomain>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = () => {
  return (
    <MainArea>
      <InvalidDomain />
    </MainArea>
  );
};

export const Default = Template.bind<Story['parameters']>({});
