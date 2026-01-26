import type {Meta, StoryObj} from '@storybook/react-vite';
import Select from 'toolbar/components/base/Select';

const meta: Meta<typeof Select> = {
  title: 'components/base/Select',
  component: Select,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </>
    ),
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: (
      <>
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    variant: 'default',
    disabled: true,
    children: (
      <>
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </>
    ),
  },
};

export const HideDuration: Story = {
  args: {
    variant: 'default',
    defaultValue: '',
    'aria-label': 'Hide Toolbar',
    children: (
      <>
        <option value="" disabled>
          Select duration
        </option>
        <option value="session">This Session</option>
        <option value="day">1 Day</option>
        <option value="month">1 Month</option>
      </>
    ),
  },
};

export const WithDefaultValue: Story = {
  args: {
    variant: 'default',
    defaultValue: 'option2',
    children: (
      <>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </>
    ),
  },
};

export const PrimaryDisabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: (
      <>
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </>
    ),
  },
};
