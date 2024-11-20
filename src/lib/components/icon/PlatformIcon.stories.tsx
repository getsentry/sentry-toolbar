import type {Meta, StoryObj} from '@storybook/react';
import PlatformIcon, {PLATFORMS} from 'toolbar/components/icon/PlatformIcon';
import {iconSizes} from 'toolbar/components/icon/types';

const meta: Meta<typeof PlatformIcon> = {
  title: 'Components/icon/PlatformIcon',
  component: PlatformIcon,
  argTypes: {
    platform: {
      control: 'select',
      options: PLATFORMS,
    },
    size: {
      control: 'select',
      options: Object.keys(iconSizes),
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlatformIcon>;

export const All: Story = {
  args: {
    size: 'md',
  },
};

All.decorators = [
  () => {
    return (
      <div className="grid grid-flow-row gap-1">
        {PLATFORMS.map(platform => (
          <span key={platform}>
            <PlatformIcon {...All.args} platform={platform} />
            {platform}
          </span>
        ))}
      </div>
    );
  },
];

export const Sizes: Story = {
  args: {
    platform: 'git',
  },
};

Sizes.decorators = [
  () => {
    return (
      <div className="flex flex-row flex-wrap gap-1">
        {Object.keys(iconSizes).map(size => (
          <span key={size}>
            <PlatformIcon {...Sizes.args} size={size} />
            {size}
          </span>
        ))}
      </div>
    );
  },
];
