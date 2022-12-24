import * as React from 'react';
import {RouteProps} from 'react-router';
import { counties } from '../../assets/counties';
import './CountiesSelector.css';
import Select from 'react-dropdown-select';
import {IonLabel} from '@ionic/react';

interface CountyProps extends RouteProps {
    counties: {name: string, value: string}[],
    setCounties: ((counties: {name: string, value: string}[]) => void),
    width: string
}


const CountySelector: React.FC<CountyProps> = (props: CountyProps) => {
    return (
        <div className="form-div county-column">
            <IonLabel>Select Counties</IonLabel>
            <div className="county-form-div">
                <Select className={props.width}
                        options={counties}
                        values={props.counties.slice(0,2)}
                        multi
                        labelField="name"
                        valueField="value"
                        onChange={props.setCounties}
                />
            </div>
        </div>
    )
};

export default CountySelector;
