import type {Meta, StoryObj} from '@storybook/react-vite';
import TemplateName from 'toolbar/../../templates/Component/TemplateName';
import type {Props} from 'toolbar/../../templates/Component/TemplateName';

const meta = {
  title: 'Example/TemplateName',
  component: TemplateName,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof TemplateName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: (args: Props) => {
    return <TemplateName {...args} />;
  },
  args: {},
};

export const WithCode: Story = {
  render: (args: Props) => {
    // here comes the code
    return <TemplateName {...args} />;
  },
};

WithCode.args = {};

WithCode.argTypes = {};

WithCode.parameters = {
  docs: {
    source: {
      language: 'tsx',
      type: 'code',
    },
  },
};
