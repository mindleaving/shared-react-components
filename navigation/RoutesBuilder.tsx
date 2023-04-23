import { Routes, Route } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { RouteDefinition } from '../types/frontendTypes';

interface RoutesBuilderProps {
    routeDefinitions: RouteDefinition[];
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
                    : <PageContainer>{routeDefinition.element}</PageContainer>
                } 
            />
        ))}
    </Routes>);

}
export default RoutesBuilder;