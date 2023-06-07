import { Routes, Route } from 'react-router-dom';
import { RouteDefinition } from '../types/frontendTypes';
import { ReactNode } from 'react';

interface RoutesBuilderProps {
    routeDefinitions: RouteDefinition[];
    containerBuilder: (children: ReactNode) => ReactNode;
}

export const RoutesBuilder = (props: RoutesBuilderProps) => {

    return (
    <Routes>
        {props.routeDefinitions.map(routeDefinition => (
            <Route
                key={routeDefinition.path}
                path={routeDefinition.path} 
                element={routeDefinition.usesCustomLayout 
                    ? routeDefinition.element
                    : props.containerBuilder(routeDefinition.element)
                } 
            />
        ))}
    </Routes>);

}
export default RoutesBuilder;