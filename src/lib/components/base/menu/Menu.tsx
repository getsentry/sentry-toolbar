import type {Placement} from '@floating-ui/react';
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import {cva, cx} from 'cva';
import type {
  ButtonHTMLAttributes,
  MouseEvent,
  FocusEvent,
  Dispatch,
  HTMLProps,
  ReactNode,
  SetStateAction,
  ReactElement,
} from 'react';
import {createContext, forwardRef, useContext, useEffect, useRef, useState} from 'react';
import PortalTargetContext from 'toolbar/context/PortalTargetContext';

const rootMenuClassName = cva(['rounded-lg', 'border', 'border-surface-400', 'p-0.5']);
const menuClassName = cva([
  'bg-surface-400',
  'border-translucentGray-200',
  'border',
  'max-w-60',
  'outline-none',
  'p-0.5',
  'rounded-lg',
  'shadow-shadow-heavy',
  'shadow-sm',
  'text-gray-400',
  'text-xs',
  'z-menu',
]);
const menuItemClassName = cx([
  'bg-transparent',
  'border-none',
  'flex',
  'focus:bg-translucentGray-100',
  'items-center',
  'justify-center',
  'm-0',
  'min-w-28',
  'outline-none',
  'px-1.5',
  'py-1',
  'rounded-md',
  'text-left',
  'w-full',
]);

const MenuContext = createContext<{
  getItemProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;
  activeIndex: number | null;
  setActiveIndex: Dispatch<SetStateAction<number | null>>;
  setHasFocusInside: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
}>({
  getItemProps: () => ({}),
  activeIndex: null,
  setActiveIndex: () => {},
  setHasFocusInside: () => {},
  isOpen: false,
});

interface MenuProps {
  trigger: ReactElement | string;
  children?: ReactNode;
  isOpen?: boolean;
  nested?: boolean;
  placement?: Placement | undefined;
}

export const MenuComponent = forwardRef<HTMLButtonElement, MenuProps & HTMLProps<HTMLButtonElement>>(
  function MenuComponent(
    {children, isOpen: defaultIsOpen, label, placement, trigger, ...props}: MenuProps & HTMLProps<HTMLButtonElement>,
    forwardedRef
  ) {
    const portalTarget = useContext(PortalTargetContext);
    const [isOpen, setIsOpen] = useState(defaultIsOpen ?? false);
    const [hasFocusInside, setHasFocusInside] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const elementsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const labelsRef = useRef<(string | null)[]>([]);
    const parent = useContext(MenuContext);

    const tree = useFloatingTree();
    const nodeId = useFloatingNodeId();
    const parentId = useFloatingParentNodeId();
    const item = useListItem();

    const isNested = parentId != null;

    const {floatingStyles, refs, context} = useFloating<HTMLButtonElement>({
      nodeId,
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: isNested ? 'right-start' : (placement ?? 'bottom-start'),
      middleware: [offset({mainAxis: isNested ? 0 : 4, alignmentAxis: isNested ? -4 : 0}), flip(), shift()],
      whileElementsMounted: autoUpdate,
    });

    const hover = useHover(context, {
      enabled: isNested,
      delay: {open: 75},
      handleClose: safePolygon({blockPointerEvents: true}),
    });
    const click = useClick(context, {
      event: 'mousedown',
      toggle: !isNested,
      ignoreMouse: isNested,
    });
    const role = useRole(context, {role: 'menu'});
    const dismiss = useDismiss(context, {bubbles: true});
    const listNavigation = useListNavigation(context, {
      listRef: elementsRef,
      activeIndex,
      nested: isNested,
      onNavigate: setActiveIndex,
    });
    const typeahead = useTypeahead(context, {
      listRef: labelsRef,
      onMatch: isOpen ? setActiveIndex : undefined,
      activeIndex,
    });

    const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
      hover,
      click,
      role,
      dismiss,
      listNavigation,
      typeahead,
    ]);

    // Event emitter allows you to communicate across tree components.
    // This effect closes all menus when an item gets clicked anywhere
    // in the tree.
    useEffect(() => {
      if (!tree) {
        return;
      }

      function handleTreeClick() {
        setIsOpen(false);
      }

      function onSubMenuOpen(event: {nodeId: string; parentId: string}) {
        if (event.nodeId !== nodeId && event.parentId === parentId) {
          setIsOpen(false);
        }
      }

      tree.events.on('click', handleTreeClick);
      tree.events.on('menuopen', onSubMenuOpen);

      return () => {
        tree.events.off('click', handleTreeClick);
        tree.events.off('menuopen', onSubMenuOpen);
      };
    }, [tree, nodeId, parentId]);

    useEffect(() => {
      if (isOpen && tree) {
        tree.events.emit('menuopen', {parentId, nodeId});
      }
    }, [tree, isOpen, nodeId, parentId]);

    return (
      <FloatingNode id={nodeId}>
        <button
          ref={useMergeRefs([refs.setReference, item.ref, forwardedRef])}
          tabIndex={!isNested ? undefined : parent.activeIndex === item.index ? 0 : -1}
          role={isNested ? 'menuitem' : undefined}
          data-open={isOpen ? '' : undefined}
          data-nested={isNested ? '' : undefined}
          data-focus-inside={hasFocusInside ? '' : undefined}
          className={isNested ? menuItemClassName : rootMenuClassName({className: props.className ?? ''})}
          {...getReferenceProps(
            parent.getItemProps({
              ...props,
              onFocus(event: FocusEvent<HTMLButtonElement>) {
                props.onFocus?.(event);
                setHasFocusInside(false);
                parent.setHasFocusInside(true);
              },
            })
          )}>
          {trigger}
          {isNested && (
            <span aria-hidden style={{marginLeft: 10, fontSize: 10}}>
              ▶
            </span>
          )}
        </button>
        <MenuContext.Provider
          value={{
            activeIndex,
            setActiveIndex,
            getItemProps,
            setHasFocusInside,
            isOpen,
          }}>
          <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
            {isOpen && (
              <FloatingPortal root={portalTarget}>
                <FloatingFocusManager
                  context={context}
                  modal={false}
                  initialFocus={isNested ? -1 : 0}
                  returnFocus={!isNested}>
                  <div
                    ref={refs.setFloating}
                    className={menuClassName()}
                    style={floatingStyles}
                    {...getFloatingProps()}>
                    {children}
                  </div>
                </FloatingFocusManager>
              </FloatingPortal>
            )}
          </FloatingList>
        </MenuContext.Provider>
      </FloatingNode>
    );
  }
);

interface MenuItemProps {
  label: string;
  disabled?: boolean;
  children?: ReactNode;
}

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps & ButtonHTMLAttributes<HTMLButtonElement>>(
  function MenuItem(
    {children, label, disabled, ...props}: MenuItemProps & ButtonHTMLAttributes<HTMLButtonElement>,
    forwardedRef
  ) {
    const menu = useContext(MenuContext);
    const item = useListItem({label: disabled ? null : label});
    const tree = useFloatingTree();
    const isActive = item.index === menu.activeIndex;

    return (
      <button
        {...props}
        ref={useMergeRefs([item.ref, forwardedRef])}
        type="button"
        role="menuitem"
        className={menuItemClassName}
        tabIndex={isActive ? 0 : -1}
        disabled={disabled}
        {...menu.getItemProps({
          onClick(event: MouseEvent<HTMLButtonElement>) {
            props.onClick?.(event);
            tree?.events.emit('click');
          },
          onFocus(event: FocusEvent<HTMLButtonElement>) {
            props.onFocus?.(event);
            menu.setHasFocusInside(true);
          },
        })}>
        {children ? children : <span className="flex grow">{label}</span>}
      </button>
    );
  }
);

export const Menu = forwardRef<HTMLButtonElement, MenuProps & HTMLProps<HTMLButtonElement>>(function Menu(props, ref) {
  const parentId = useFloatingParentNodeId();

  if (parentId === null) {
    return (
      <FloatingTree>
        <MenuComponent {...props} ref={ref} />
      </FloatingTree>
    );
  }

  return <MenuComponent {...props} ref={ref} />;
});
