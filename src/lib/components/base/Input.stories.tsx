import type {Meta, StoryObj} from '@storybook/react-vite';
import Input from 'toolbar/components/base/Input';

const meta: Meta<typeof Input> = {
  title: 'components/base/Input',
  component: Input,
  argTypes: {
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Placeholder...',
  },
};
