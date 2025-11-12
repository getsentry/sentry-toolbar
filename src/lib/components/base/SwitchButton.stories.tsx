import type {Meta, StoryObj} from '@storybook/react-vite';
import SwitchButton from 'toolbar/components/base/SwitchButton';

const meta: Meta<typeof SwitchButton> = {
  title: 'components/base/SwitchButton',
  component: SwitchButton,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'lg'],
    },
    isActive: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SwitchButton>;

export const Default: Story = {
  args: {
    size: 'sm',
    isActive: false,
  },
};
