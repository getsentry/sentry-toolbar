import type {Meta, StoryObj} from '@storybook/react-vite';
import {cx} from 'cva';

// Checkerboard pattern for showing colors against a neutral contrast background
const checkerboardStyle = {
  backgroundImage: `
    linear-gradient(45deg, #808080 25%, transparent 25%),
    linear-gradient(-45deg, #808080 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #808080 75%),
    linear-gradient(-45deg, transparent 75%, #808080 75%)
  `,
  backgroundSize: '8px 8px',
  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
  backgroundColor: '#c0c0c0',
};

interface ColorSwatchProps {
  name: string;
  cssVar: string;
  tailwindClass: string;
}

function ColorSwatch({name, cssVar, tailwindClass}: ColorSwatchProps) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      {/* Outer container with checkerboard to show transparency/light colors */}
      <div className="size-[32px] shrink-0 overflow-hidden rounded shadow-md" style={checkerboardStyle}>
        <div className={cx('size-full', tailwindClass)} title={cssVar} />
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-[12px] text-black">{name}</span>
        <span className="font-mono text-[10px] text-gray-300">{cssVar}</span>
      </div>
    </div>
  );
}

interface ColorGroupProps {
  title: string;
  colors: ColorSwatchProps[];
}

function ColorGroup({title, colors}: ColorGroupProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <h3 className="mb-0.5 border-b border-gray-300 pb-0.5 text-[14px] font-semibold text-black">{title}</h3>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.25">
        {colors.map(color => (
          <ColorSwatch key={color.name} {...color} />
        ))}
      </div>
    </div>
  );
}

function ColorPalette() {
  const colorGroups: ColorGroupProps[] = [
    {
      title: 'Base',
      colors: [
        {name: 'white', cssVar: 'var(--white)', tailwindClass: 'bg-white'},
        {name: 'black', cssVar: 'var(--black)', tailwindClass: 'bg-black'},
        {name: 'sentryPurple', cssVar: 'var(--sentry-purple)', tailwindClass: 'bg-sentryPurple'},
      ],
    },
    {
      title: 'Surface',
      colors: [
        {name: 'surface-100', cssVar: 'var(--surface-100)', tailwindClass: 'bg-surface-100'},
        {name: 'surface-200', cssVar: 'var(--surface-200)', tailwindClass: 'bg-surface-200'},
        {name: 'surface-300', cssVar: 'var(--surface-300)', tailwindClass: 'bg-surface-300'},
        {name: 'surface-400', cssVar: 'var(--surface-400)', tailwindClass: 'bg-surface-400'},
      ],
    },
    {
      title: 'Translucent Gray',
      colors: [
        {name: 'translucentGray-100', cssVar: 'var(--translucent-gray-100)', tailwindClass: 'bg-translucentGray-100'},
        {name: 'translucentGray-200', cssVar: 'var(--translucent-gray-200)', tailwindClass: 'bg-translucentGray-200'},
      ],
    },
    {
      title: 'Translucent Surface',
      colors: [
        {
          name: 'translucentSurface-100',
          cssVar: 'var(--translucent-surface-100)',
          tailwindClass: 'bg-translucentSurface-100',
        },
        {
          name: 'translucentSurface-200',
          cssVar: 'var(--translucent-surface-200)',
          tailwindClass: 'bg-translucentSurface-200',
        },
      ],
    },
    {
      title: 'Gray',
      colors: [
        {name: 'gray-100', cssVar: 'var(--gray-100)', tailwindClass: 'bg-gray-100'},
        {name: 'gray-200', cssVar: 'var(--gray-200)', tailwindClass: 'bg-gray-200'},
        {name: 'gray-300', cssVar: 'var(--gray-300)', tailwindClass: 'bg-gray-300'},
        {name: 'gray-400', cssVar: 'var(--gray-400)', tailwindClass: 'bg-gray-400'},
        {name: 'gray-500', cssVar: 'var(--gray-500)', tailwindClass: 'bg-gray-500'},
      ],
    },
    {
      title: 'Purple',
      colors: [
        {name: 'purple-100', cssVar: 'var(--purple-100)', tailwindClass: 'bg-purple-100'},
        {name: 'purple-200', cssVar: 'var(--purple-200)', tailwindClass: 'bg-purple-200'},
        {name: 'purple-300', cssVar: 'var(--purple-300)', tailwindClass: 'bg-purple-300'},
        {name: 'purple-400', cssVar: 'var(--purple-400)', tailwindClass: 'bg-purple-400'},
      ],
    },
    {
      title: 'Blue',
      colors: [
        {name: 'blue-100', cssVar: 'var(--blue-100)', tailwindClass: 'bg-blue-100'},
        {name: 'blue-200', cssVar: 'var(--blue-200)', tailwindClass: 'bg-blue-200'},
        {name: 'blue-300', cssVar: 'var(--blue-300)', tailwindClass: 'bg-blue-300'},
        {name: 'blue-400', cssVar: 'var(--blue-400)', tailwindClass: 'bg-blue-400'},
      ],
    },
    {
      title: 'Green',
      colors: [
        {name: 'green-100', cssVar: 'var(--green-100)', tailwindClass: 'bg-green-100'},
        {name: 'green-200', cssVar: 'var(--green-200)', tailwindClass: 'bg-green-200'},
        {name: 'green-300', cssVar: 'var(--green-300)', tailwindClass: 'bg-green-300'},
        {name: 'green-400', cssVar: 'var(--green-400)', tailwindClass: 'bg-green-400'},
      ],
    },
    {
      title: 'Yellow',
      colors: [
        {name: 'yellow-100', cssVar: 'var(--yellow-100)', tailwindClass: 'bg-yellow-100'},
        {name: 'yellow-200', cssVar: 'var(--yellow-200)', tailwindClass: 'bg-yellow-200'},
        {name: 'yellow-300', cssVar: 'var(--yellow-300)', tailwindClass: 'bg-yellow-300'},
        {name: 'yellow-400', cssVar: 'var(--yellow-400)', tailwindClass: 'bg-yellow-400'},
      ],
    },
    {
      title: 'Red',
      colors: [
        {name: 'red-100', cssVar: 'var(--red-100)', tailwindClass: 'bg-red-100'},
        {name: 'red-200', cssVar: 'var(--red-200)', tailwindClass: 'bg-red-200'},
        {name: 'red-300', cssVar: 'var(--red-300)', tailwindClass: 'bg-red-300'},
        {name: 'red-400', cssVar: 'var(--red-400)', tailwindClass: 'bg-red-400'},
      ],
    },
    {
      title: 'Pink',
      colors: [
        {name: 'pink-100', cssVar: 'var(--pink-100)', tailwindClass: 'bg-pink-100'},
        {name: 'pink-200', cssVar: 'var(--pink-200)', tailwindClass: 'bg-pink-200'},
        {name: 'pink-300', cssVar: 'var(--pink-300)', tailwindClass: 'bg-pink-300'},
        {name: 'pink-400', cssVar: 'var(--pink-400)', tailwindClass: 'bg-pink-400'},
      ],
    },
    {
      title: 'Shadow',
      colors: [
        {name: 'shadow-light', cssVar: 'var(--shadow-light)', tailwindClass: 'bg-shadow-light'},
        {name: 'shadow-medium', cssVar: 'var(--shadow-medium)', tailwindClass: 'bg-shadow-medium'},
        {name: 'shadow-heavy', cssVar: 'var(--shadow-heavy)', tailwindClass: 'bg-shadow-heavy'},
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-3 p-2">
      <h2 className="text-[18px] font-bold text-black">Color Palette</h2>
      <p className="text-[12px] text-gray-400">
        Colors adapt based on the current theme (light/dark). Toggle the theme to see how colors change.
      </p>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {colorGroups.map(group => (
          <ColorGroup key={group.title} {...group} />
        ))}
      </div>
    </div>
  );
}

function RawColors() {
  return (
    <div className="flex flex-col gap-3 p-2">
      <h2 className="text-[18px] font-bold text-black">Raw Colors (Theme-Independent)</h2>
      <p className="text-[12px] text-gray-400">These colors don&apos;t change with the theme.</p>
      <div className="flex gap-2">
        <ColorSwatch name="white-raw" cssVar="#fff" tailwindClass="bg-white-raw" />
        <ColorSwatch name="black-raw" cssVar="#1d1127" tailwindClass="bg-black-raw" />
      </div>
    </div>
  );
}

function UtilityColors() {
  return (
    <div className="flex flex-col gap-3 p-2">
      <h2 className="text-[18px] font-bold text-black">Utility Colors</h2>
      <div className="flex gap-2">
        <div className="flex items-center gap-2">
          <div className="size-[32px] shrink-0 overflow-hidden rounded shadow-md" style={checkerboardStyle}>
            <div className="size-full bg-transparent" />
          </div>
          <span className="font-mono text-[12px] text-black">transparent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-[32px] shrink-0 overflow-hidden rounded shadow-md" style={checkerboardStyle}>
            <div className="size-full bg-current" />
          </div>
          <span className="font-mono text-[12px] text-black">current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-[32px] shrink-0 overflow-hidden rounded shadow-md" style={checkerboardStyle}>
            <div className="size-full bg-inherit" />
          </div>
          <span className="font-mono text-[12px] text-black">inherit</span>
        </div>
      </div>
    </div>
  );
}

interface StoryArgs {
  theme: 'light' | 'dark';
}

const meta: Meta<typeof ColorPalette> = {
  title: 'Design System/Color Palette',
  component: ColorPalette,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: {
      control: 'radio',
      options: ['light', 'dark'],
      description: 'Toggle between light and dark theme',
    },
  },
  args: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => (
      <div data-theme={(context.args as StoryArgs).theme} className="min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ColorPalette & StoryArgs>;

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4 bg-surface-200 p-3">
      <ColorPalette />
      <hr className="border-gray-200" />
      <RawColors />
      <hr className="border-gray-200" />
      <UtilityColors />
    </div>
  ),
};
