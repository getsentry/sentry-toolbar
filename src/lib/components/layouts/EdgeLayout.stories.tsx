import type {Meta} from '@storybook/react';
import type {ComponentProps} from 'react';
import {Fragment} from 'react/jsx-runtime';
import EdgeLayout, {MainArea, NavArea} from 'toolbar/components/layouts/EdgeLayout';
import Navigation from 'toolbar/components/Navigation';

const meta = {
  title: 'components/EdgeLayout',
  component: EdgeLayout,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    theme: 'light',
    storage: {
      useNavigationExpansion_isPinned: true,
    },
    config: {
      theme: 'light',
    },
  },
  args: {
    placement: 'right-edge',
    children: <Fragment>Some content</Fragment>,
  },
} as Meta<typeof EdgeLayout>;

export default meta;

const Template = ({placement}: ComponentProps<typeof EdgeLayout>) => {
  return (
    <EdgeLayout placement={placement}>
      <NavArea placement={placement}>
        <Navigation placement={placement} />
      </NavArea>
      <MainArea placement={placement}>Empty Panel</MainArea>
    </EdgeLayout>
  );
};

export const Default = Template.bind({});
