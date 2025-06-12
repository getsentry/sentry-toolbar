import type {Meta, StoryObj} from '@storybook/react';
import type {ComponentProps} from 'react';
import IconAdd from 'toolbar/components/icon/IconAdd';
import IconChat from 'toolbar/components/icon/IconChat';
import IconChevron from 'toolbar/components/icon/IconChevron';
import IconClose from 'toolbar/components/icon/IconClose';
import IconContract from 'toolbar/components/icon/IconContract';
import IconExpand from 'toolbar/components/icon/IconExpand';
import IconFatal from 'toolbar/components/icon/IconFatal';
import IconFlag from 'toolbar/components/icon/IconFlag';
import IconImage from 'toolbar/components/icon/IconImage';
import IconIssues from 'toolbar/components/icon/IconIssues';
import IconLock from 'toolbar/components/icon/IconLock';
import IconMegaphone from 'toolbar/components/icon/IconMegaphone';
import IconPin from 'toolbar/components/icon/IconPin';
import IconPlay from 'toolbar/components/icon/IconPlay';
import IconQuestion from 'toolbar/components/icon/IconQuestion';
import IconSentry from 'toolbar/components/icon/IconSentry';
import IconSettings from 'toolbar/components/icon/IconSettings';
import IconShow from 'toolbar/components/icon/IconShow';
import SVGIconBase from 'toolbar/components/icon/SVGIconBase';
import type {IconProps} from 'toolbar/components/icon/types';
import {iconSizes} from 'toolbar/components/icon/types';

const icons = {
  IconAdd,
  IconChat,
  IconChevron,
  IconClose,
  IconContract,
  IconExpand,
  IconFatal,
  IconFlag,
  IconImage,
  IconIssues,
  IconLock,
  IconMegaphone,
  IconPin,
  IconPlay,
  IconQuestion,
  IconSentry,
  IconSettings,
  IconShow,
};

const meta: Meta<typeof SVGIconBase> = {
  title: 'Components/icon/SVGIconBase',
  component: SVGIconBase,
  argTypes: {
    size: {
      control: 'select',
      options: Object.keys(iconSizes),
    },
  },
};

export default meta;
type Story = StoryObj<typeof SVGIconBase>;

export const All: Story = {
  args: {
    size: 'md',
  },
};

All.decorators = [
  () => {
    return (
      <div className="grid grid-flow-row gap-1">
        {Object.entries(icons).map(([name, Icon]) => (
          <span key={name}>
            <Icon {...(All.args as ComponentProps<typeof Icon>)} direction={undefined} />
            {name}
          </span>
        ))}
      </div>
    );
  },
];

export const Sizes: Story = {
  args: {},
};

Sizes.decorators = [
  () => {
    return (
      <div className="flex flex-row flex-wrap gap-1">
        {Object.keys(iconSizes).map(size => (
          <span key={size}>
            <IconAdd {...Sizes.args} size={size as IconProps['size']} />
            {size}
          </span>
        ))}
      </div>
    );
  },
];
