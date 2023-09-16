import { PropsWithChildren, useEffect, useState } from "react";
import { Tabs } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

interface TabsUrlControlledProps {
    urlParameterName?: string;
    validTabs: string[];
    urlBuilder?: (tab: string) => string;
    id?: string;
    className?: string;
    mountOnEnter?: boolean;
    unmountOnExit?: boolean;
}

const defaultUrlParameterName = "tab";
export const TabsUrlControlled = (props: PropsWithChildren<TabsUrlControlledProps>) => {

    const { urlParameterName, validTabs, urlBuilder, id, className, mountOnEnter, unmountOnExit } = props;

    const [ q ] = useSearchParams();
    const tabFromUrl = q.get(urlParameterName ?? defaultUrlParameterName)?.toLowerCase();
    const [ selectedTab, setSelectedTab ] = useState<string>(tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : validTabs[0]);
    const navigate = useNavigate();

    useEffect(() => {
        const requestedTab = q.get(urlParameterName ?? defaultUrlParameterName);
        if(requestedTab && validTabs.includes(requestedTab)) {
            setSelectedTab(requestedTab);
        }
    }, [ q, validTabs ]);

    return (
        <Tabs
            id={id}
            className={className}
            activeKey={selectedTab} 
            onSelect={(key:any) => navigate(urlBuilder ? urlBuilder(key) : `${window.location.pathname}?tab=${key}`)}
            mountOnEnter={mountOnEnter}
            unmountOnExit={unmountOnExit}
        >
            {props.children}
        </Tabs>
    );

}