import * as React from 'react';
import {RouteProps} from 'react-router';
import './DDSelector.css';
import Select from 'react-dropdown-select';
import {IonLabel} from '@ionic/react';

interface DDProps extends RouteProps {
    title:string,
    data: {name: string, value: string}[],
    onDataChange: ((data: {name: string, value: string}[]) => void),
    options: {name: string, value: string}[],
    width: string
    allowMultipleOption:boolean
}


const DDSelector: React.FC<DDProps> = (props: DDProps) => {
    return (
        <div className="form-div county-column">
            <IonLabel>{props.title}</IonLabel>
            <div className="county-form-div">
                <Select className={props.width}
                        options={props.options}
                        values={props.data}
                        multi={props.allowMultipleOption}
                        labelField="name"
                        valueField="value"
                        onChange={props.onDataChange}
                />
            </div>
        </div>
    )
};

export default DDSelector;
