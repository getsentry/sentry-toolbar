import type {Meta, StoryObj} from '@storybook/react';
import {cx} from 'cva';
import {useState} from 'react';
import {Menu, MenuItem} from 'toolbar/components/base/menu/Menu';
import IconLock from 'toolbar/components/icon/IconLock';
import IconPin from 'toolbar/components/icon/IconPin';

const meta: Meta<typeof Menu> = {
  title: 'components/base/menu/Menu',
  component: Menu,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  args: {},
  render: () => {
    return (
      <Menu trigger="Click to open">
        <MenuItem label="First" />
        <MenuItem label="Second" />
      </Menu>
    );
  },
};

export const Open: Story = {
  args: {},
  render: () => {
    return (
      <Menu trigger="Click to open" isOpen>
        <MenuItem label="First" />
        <hr className="mx-1 my-0.5" />
        <MenuItem label="Second" />
      </Menu>
    );
  },
};

const iconItemClass = cx('flex grow gap-1');

export const WithIcons: Story = {
  args: {},
  render: () => {
    const [isPinned, setIsPinned] = useState(false);

    return (
      <Menu trigger="Click to open" isOpen>
        <MenuItem
          label="pin"
          onClick={() => {
            setIsPinned(!isPinned);
          }}>
          <div className={iconItemClass}>
            <IconPin size="sm" isSolid={isPinned} />
            {isPinned ? 'Un-Pin' : 'Pin'}
          </div>
        </MenuItem>
        <hr className="mx-1 my-0.5" />
        <MenuItem
          label="logout"
          onClick={() => {
            console.log('log out');
          }}>
          <div className={iconItemClass}>
            <IconLock size="sm" isLocked={false} />
            Logout
          </div>
        </MenuItem>
      </Menu>
    );
  },
};
