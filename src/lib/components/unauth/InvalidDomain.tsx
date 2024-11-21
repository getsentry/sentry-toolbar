import UnauthPill from 'toolbar/components/unauth/UnauthPill';

export default function InvalidDomain() {
  return (
    <UnauthPill>
      <span className="p-1">The domain is invalid or not configured</span>
    </UnauthPill>
  );
}
