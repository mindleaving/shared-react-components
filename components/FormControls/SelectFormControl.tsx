import { FormSelect } from "react-bootstrap";
import { CustomFormControlProps } from "../../types/frontendTypes";
import { resolveText } from "../../helpers/Globalizer";
import { CSSProperties } from "react";

interface SelectFormControlProps extends CustomFormControlProps {
    enumValues: string[];
    enumName: string;
    value?: string;
    onChange: (value: string | undefined) => void;
    noSelectionDisplayName?: string;
    colorMap?: {
        [enumValue:string]: CSSProperties
    }
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
        noSelectionDisplayName,
        colorMap
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
        style={!!colorMap && !!value ? colorMap[value] : undefined}
    >
        <option value="">{noSelectionDisplayName ?? resolveText("PleaseSelect...")}</option>
        {Object.values(enumValues).map(x => (
            <option 
                key={x} 
                value={x}
                style={!!colorMap ? colorMap[x] : undefined}
            >
                {resolveText(`${enumName}_${x}`)}
            </option>
        ))}
    </FormSelect>);

}