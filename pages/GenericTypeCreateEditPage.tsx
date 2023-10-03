import { useEffect, useState } from 'react';
import { resolveText } from '../helpers/Globalizer';
import { useParams } from 'react-router-dom';
import { showErrorAlert } from '../helpers/AlertHelpers';
import { GenericTypeForm } from '../components/ReactJsonSchemaForm/GenericTypeForm';
import { LoadingAlert } from '../components/LoadingAlert';
import { uuid } from '../helpers/uuid';

interface GenericTypeCreateEditPageProps<T> {
    typeName: string;
    paramName?: string;
    item?: T;
    itemLoader?: (id: string) => Promise<T>;
    uiSchema?: any;
    onSubmit: (item: T) => Promise<any>;
    onChange?: (formData: T) => void;
}

export const GenericTypeCreateEditPage = <T extends unknown>(props: GenericTypeCreateEditPageProps<T>) => {

    const { [props.paramName ?? "id"]: id } = useParams();
    const [ isLoadingItem, setIsLoadingItem ] = useState<boolean>(!!props.itemLoader);
    const [ formData, setFormData ] = useState<T>(props.item ?? { id: uuid() } as T);

    useEffect(() => {
        if(!props.itemLoader || !id) {
            setIsLoadingItem(false);
            return;
        }
        const loadItem = async () => {
            try {
                const item = await props.itemLoader!(id);
                setFormData(item);
            } catch(error: any) {
                showErrorAlert(resolveText("GenericTypeCreateEditPage_CoultNotLoadItem"), error.message);
            } finally {
                setIsLoadingItem(false);
            }
        };
        loadItem();
    }, [ id ]);

    const onChange = (formData: any) => {
        setFormData(formData);
        if(props.onChange) {
            props.onChange(formData);
        }
    }

    if(isLoadingItem) {
        return (<LoadingAlert />);
    }
    
    return (<GenericTypeForm
        typeName={props.typeName}
        formData={formData}
        onChange={onChange}
        onSubmit={() => props.onSubmit(formData)}
        uiSchema={props.uiSchema}
    />)

}
