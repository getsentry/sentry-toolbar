import type {Meta} from '@storybook/react-vite';
import EdgeLayout, {NavArea} from 'toolbar/components/layouts/EdgeLayout';
import NavigationPanel from 'toolbar/components/panels/nav/NavigationPanel';
import {useConfigContext, StaticConfigProvider} from 'toolbar/context/ConfigContext';
import type {Configuration} from 'toolbar/types/Configuration';

const meta = {
  title: 'components/panels/nav/NavigationPanel',
  component: NavigationPanel,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  args: {
    placement: 'right-edge',
  },
  argTypes: {
    placement: {
      defaultValue: 'right-edge',
      control: {type: 'select'},
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
} as Meta<typeof NavigationPanel>;

export default meta;

let key = 0;
const Template = ({placement}: {placement: Configuration['placement']}) => {
  const [baseConfig] = useConfigContext();
  return (
    <StaticConfigProvider key={key++} config={{...baseConfig, placement}}>
      <EdgeLayout>
        <NavArea>
          <NavigationPanel />
        </NavArea>
      </EdgeLayout>
    </StaticConfigProvider>
  );
};

export const LightTheme = Template.bind({});
// @ts-expect-error: Property 'parameters' does not exist on type
LightTheme.parameters = {
  storage: {useNavigationExpansion_isPinned: false},
  config: {theme: 'light'},
};

export const DarkTheme = Template.bind({});
// @ts-expect-error: Property 'parameters' does not exist on type
DarkTheme.parameters = {
  storage: {useNavigationExpansion_isPinned: false},
  config: {theme: 'dark'},
};

export const LightPinnedTheme = Template.bind({});
// @ts-expect-error: Property 'parameters' does not exist on type
LightPinnedTheme.parameters = {
  storage: {useNavigationExpansion_isPinned: true},
  config: {theme: 'light'},
};

export const DarkPinnedTheme = Template.bind({});
// @ts-expect-error: Property 'parameters' does not exist on type
DarkPinnedTheme.parameters = {
  storage: {useNavigationExpansion_isPinned: true},
  config: {theme: 'dark'},
};
