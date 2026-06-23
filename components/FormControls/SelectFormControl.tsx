import { FormSelect } from "react-bootstrap";
import { CustomFormControlProps } from "../../types/frontendTypes";
import { resolveText } from "../../helpers/Globalizer";

interface SelectFormControlProps extends CustomFormControlProps {
    enumValues: string[];
    enumName: string;
    value?: string;
    onChange: (value: string | undefined) => void;
    noSelectionDisplayName?: string;
}

export const SelectFormControl = (props: SelectFormControlProps) => {

    const { 
        enumValues, 
        enumName, 
        value, 
        onChange,
        required,
        disabled,
        size,
        noSelectionDisplayName
    } = props;

    return (<FormSelect
        value={value ?? ''}
        onChange={e => {
            if(e.target.value) {
                onChange(e.target.value);
            } else {
                onChange(undefined);
            }
        }}
        required={required}
        disabled={disabled}
        size={size}
        isValid={props.isValid}
        isInvalid={props.isInvalid}
        aria-describedby={props.ariaDescribedBy}
    >
        <option value="">{noSelectionDisplayName ?? resolveText("PleaseSelect...")}</option>
        {Object.values(enumValues).map(x => (
            <option key={x} value={x}>{resolveText(`${enumName}_${x}`)}</option>
        ))}
    </FormSelect>);

}