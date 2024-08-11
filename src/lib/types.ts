export interface Configuration {
    apiPrefix: string;
    cdn: string;
    environment: string | string[];
    organizationSlug: string;
    placement: 'right-edge' | 'bottom-right-corner';
    projectId: number;
    projectPlatform: string;
    projectSlug: string;
    //   SentrySDK?: typeof SentrySDK;
    domId?: string;
    //   featureFlags?: {
    //     clearOverrides?: () => void;
    //     getFeatureFlagMap?: () => FeatureFlagMap;
    //     setOverrideValue?: (name: string, override: FlagValue) => void;
    //     urlTemplate?: (name: string) => string | undefined;
    //   };

    trackAnalytics?: (props: {eventKey: string; eventName: string}) => void;
}
