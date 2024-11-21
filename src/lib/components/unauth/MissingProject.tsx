import UnauthPill from 'toolbar/components/unauth/UnauthPill';

export default function MissingProject() {
  return (
    <UnauthPill>
      <span className="p-1">Missing Project</span>
    </UnauthPill>
  );
}
