import type {Meta} from '@storybook/react-vite';
import EdgeLayout, {MainArea, NavArea} from 'toolbar/components/layouts/EdgeLayout';
import Navigation from 'toolbar/components/Navigation';
import {StaticConfigProvider, useConfigContext} from 'toolbar/context/ConfigContext';
import type {Configuration} from 'toolbar/types/Configuration';

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
  },
  argTypes: {
    placement: {
      defaultValue: 'right-edge',
      control: {
        type: 'select',
      },
      options: [
        'top-left-corner',
        'top-edge',
        'top-right-corner',
        'bottom-left-corner',
        'bottom-edge',
        'bottom-right-corner',
        'left-top-corner',
        'left-edge',
        'left-bottom-corner',
        'right-top-corner',
        'right-edge',
        'right-bottom-corner',
      ],
    },
  },
} as Meta<typeof EdgeLayout>;

export default meta;

let key = 0;
const Template = ({placement}: {placement: Configuration['placement']}) => {
  const [baseConfig] = useConfigContext();
  return (
    <StaticConfigProvider key={key++} config={{...baseConfig, placement}}>
      <EdgeLayout>
        <NavArea>
          <Navigation />
        </NavArea>
        <MainArea>Empty Panel</MainArea>
      </EdgeLayout>
    </StaticConfigProvider>
  );
};

export const Default = Template.bind({});
