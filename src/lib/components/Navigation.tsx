import IconClose from 'toolbar/components/icons/iconClose';
import IconIssues from 'toolbar/components/icons/iconIssues';
import IconButton from 'toolbar/components/navigation/IconButton';
import NavButton from 'toolbar/components/navigation/NavButton';

export default function Navigation() {
  return (
    <div className="bg-purple-600">
      <IconButton onClick={() => {}} title="Hide for this session" icon={<IconClose />} />

      <hr className="m-0 w-full" />

      <NavButton to="/settings" label="Settings" icon={<IconIssues />} />
    </div>
  );
}
