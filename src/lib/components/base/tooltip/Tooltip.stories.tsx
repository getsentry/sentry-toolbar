import type {Meta, StoryObj} from '@storybook/react-vite';
import {Tooltip, TooltipTrigger, TooltipContent} from 'toolbar/components/base/tooltip/Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'components/base/tooltip/Tooltip',
  component: Tooltip,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {},
  render: () => {
    return (
      <Tooltip>
        <TooltipTrigger>today</TooltipTrigger>
        <TooltipContent>{new Date().toISOString()}</TooltipContent>
      </Tooltip>
    );
  },
};

export const PointingDown: Story = {
  args: {},
  render: () => {
    return (
      <Tooltip open>
        <TooltipTrigger>today</TooltipTrigger>
        <TooltipContent>{new Date().toISOString()}</TooltipContent>
      </Tooltip>
    );
  },
};

export const PointingUp: Story = {
  args: {},
  render: () => {
    return (
      <div className="mt-24">
        <Tooltip open>
          <TooltipTrigger>today</TooltipTrigger>
          <TooltipContent>{new Date().toISOString()}</TooltipContent>
        </Tooltip>
      </div>
    );
  },
};
