import * as React from 'react';
import {RouteProps} from 'react-router';
import './CountiesSelector.css';
import Select from 'react-dropdown-select';
import {IonLabel} from '@ionic/react';


interface CountyWithAliasProps extends RouteProps {
    counties: {name: string, value: string[]}[],
    setCounties: ((counties: {name: string, value: string[]}[]) => void),
    options: {name: string, value: string[]}[],
    type: string,
    width: string
}

const CountySelectorWithAlias: React.FC<CountyWithAliasProps> = (props: CountyWithAliasProps) => {
    return (
        <div className="form-div county-column">
            {props.type === 'counties' && <IonLabel>Select County</IonLabel>}
            {props.type === 'roads' && <IonLabel>Select Roads</IonLabel>}
            <div className="county-form-div">
                <Select className={props.width}
                        options={props.options}
                        values={props.counties}
                        multi={true}
                        labelField="name"
                        valueField="value"
                        onChange={props.setCounties}
                />
            </div>
        </div>
    )
};


export default CountySelectorWithAlias ;
