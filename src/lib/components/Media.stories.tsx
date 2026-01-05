import type {Meta, StoryObj} from '@storybook/react-vite';
import AvatarIcon from 'toolbar/components/avatar/AvatarIcon';
import Placeholder from 'toolbar/components/base/Placeholder';
import IconIssues from 'toolbar/components/icon/IconIssues';
import IconMegaphone from 'toolbar/components/icon/IconMegaphone';
import IconSettings from 'toolbar/components/icon/IconSettings';
import PlatformIcon from 'toolbar/components/icon/PlatformIcon';
import Media from 'toolbar/components/Media';

const meta: Meta<typeof Media> = {
  title: 'Components/Media',
  component: Media,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  decorators: [
    Story => (
      <div style={{width: '280px'}}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Media>;

// Basic examples with different media types

export const WithAvatar: Story = {
  args: {
    media: <AvatarIcon name="Jane Doe" type="user" tooltip="Jane Doe" size="lg" />,
    title: 'Jane Doe',
    description: 'jane.doe@example.com',
    size: 'md',
  },
};

export const WithTeamAvatar: Story = {
  args: {
    media: <AvatarIcon name="Platform Team" type="team" tooltip="Platform Team" size="lg" />,
    title: 'Platform Team',
    description: '12 members',
    size: 'md',
  },
};

export const WithAvatarUrl: Story = {
  args: {
    media: (
      <AvatarIcon
        name="Sentry User"
        avatarUrl="https://avatars.githubusercontent.com/u/1396951"
        type="user"
        tooltip="Sentry User"
        size="lg"
      />
    ),
    title: 'Sentry User',
    description: 'user@sentry.io',
    size: 'md',
  },
};

export const WithPlatformIcon: Story = {
  args: {
    media: <PlatformIcon platform="javascript-react" size="lg" />,
    title: 'frontend-app',
    description: 'javascript-react',
    size: 'md',
  },
};

export const WithPlatformIconPython: Story = {
  args: {
    media: <PlatformIcon platform="python-django" size="lg" />,
    title: 'backend-api',
    description: 'python-django',
    size: 'md',
  },
};

export const WithIcon: Story = {
  args: {
    media: <IconSettings size="lg" />,
    title: 'Settings',
    description: 'Manage your preferences',
    size: 'md',
  },
};

export const WithIssuesIcon: Story = {
  args: {
    media: <IconIssues size="lg" />,
    title: 'TypeError: Cannot read property',
    description: 'users/auth.js in handleLogin',
    size: 'md',
  },
};

export const WithFeedbackIcon: Story = {
  args: {
    media: <IconMegaphone size="lg" />,
    title: 'User Feedback',
    description: 'The page is loading slowly',
    size: 'md',
  },
};

// Size variants

export const SizeSmall: Story = {
  args: {
    media: <IconSettings size="sm" />,
    title: 'Small Size',
    description: 'Compact layout',
    size: 'sm',
  },
};

export const SizeMedium: Story = {
  args: {
    media: <IconSettings size="md" />,
    title: 'Medium Size',
    description: 'Default layout',
    size: 'md',
  },
};

export const SizeLarge: Story = {
  args: {
    media: <IconSettings size="lg" />,
    title: 'Large Size',
    description: 'Spacious layout',
    size: 'lg',
  },
};

// Without description

export const TitleOnly: Story = {
  args: {
    media: <PlatformIcon platform="node" size="lg" />,
    title: 'Node.js Application',
    size: 'md',
  },
};

// All sizes comparison

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Media
        media={<AvatarIcon name="Small" type="user" tooltip="Small" size="sm" />}
        title="Small (sm)"
        description="Compact variant"
        size="sm"
      />
      <Media
        media={<AvatarIcon name="Medium" type="user" tooltip="Medium" size="md" />}
        title="Medium (md)"
        description="Default variant"
        size="md"
      />
      <Media
        media={<AvatarIcon name="Large" type="user" tooltip="Large" size="lg" />}
        title="Large (lg)"
        description="Spacious variant"
        size="lg"
      />
    </div>
  ),
};

// Placeholder examples

export const PlaceholderMedia: Story = {
  args: {
    media: <Placeholder height="full" width="full" shape="round" />,
    title: 'Loading...',
    description: 'Please wait',
    size: 'md',
  },
};

export const AllPlaceholders: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Media
        media={<Placeholder height="full" width="full" shape="round" />}
        title={<Placeholder height="text" style={{width: '120px'}} />}
        description={<Placeholder height="text" style={{width: '80px'}} />}
        size="sm"
      />
      <Media
        media={<Placeholder height="full" width="full" shape="round" />}
        title={<Placeholder height="text" style={{width: '140px'}} />}
        description={<Placeholder height="text" style={{width: '100px'}} />}
        size="md"
      />
      <Media
        media={<Placeholder height="full" width="full" shape="round" />}
        title={<Placeholder height="text" style={{width: '160px'}} />}
        description={<Placeholder height="text" style={{width: '120px'}} />}
        size="lg"
      />
    </div>
  ),
};

export const PlaceholderSquareMedia: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Media
        media={<Placeholder height="full" width="full" shape="square" />}
        title={<Placeholder height="text" style={{width: '100px'}} />}
        description={<Placeholder height="text" style={{width: '70px'}} />}
        size="sm"
      />
      <Media
        media={<Placeholder height="full" width="full" shape="square" />}
        title={<Placeholder height="text" style={{width: '130px'}} />}
        description={<Placeholder height="text" style={{width: '90px'}} />}
        size="md"
      />
      <Media
        media={<Placeholder height="full" width="full" shape="square" />}
        title={<Placeholder height="text" style={{width: '150px'}} />}
        description={<Placeholder height="text" style={{width: '110px'}} />}
        size="lg"
      />
    </div>
  ),
};

// Mixed content showcase

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Media
        media={<AvatarIcon name="John Smith" type="user" tooltip="John Smith" size="lg" />}
        title="John Smith"
        description="john@example.com"
        size="md"
      />
      <Media
        media={<PlatformIcon platform="javascript-nextjs" size="lg" />}
        title="my-nextjs-app"
        description="javascript-nextjs"
        size="md"
      />
      <Media media={<IconIssues size="lg" />} title="ReferenceError" description="index.js:42" size="md" />
      <Media
        media={<AvatarIcon name="Backend Team" type="team" tooltip="Backend Team" size="lg" />}
        title="Backend Team"
        description="8 members"
        size="md"
      />
    </div>
  ),
};
