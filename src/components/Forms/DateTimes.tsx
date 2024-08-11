import {IonItem, IonLabel} from '@ionic/react';
import {createTheme, MuiThemeProvider} from '@material-ui/core';
import {KeyboardDatePicker, KeyboardDateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import * as React from 'react';
import {RouteProps} from 'react-router';

import './DateTimes.css';

interface DateTimeProps extends RouteProps {
    startDate: Date | null,
    endDate: Date | null,
    handleStartDateChange: React.Dispatch<React.SetStateAction<Date | null>>,
    handleEndDateChange: React.Dispatch<React.SetStateAction<Date | null>>,
    form: string
}

/* Creating default grey theme in case of error */
let customTheme = createTheme({
    palette: {
        primary: {
            main: "#92949c",
            contrastText: '#fff'
        },
        secondary: {
            main: "#000"
        }
    },
});

const DateTimes: React.FC<DateTimeProps> = (props: DateTimeProps) => {
    const includeTime = (props.form === 'Probe');
    let startText = 'Start Date';
    let endText = 'End Date';
    if (includeTime) {
        startText += ' & Time';
        endText += ' & Time';
    }
    switch (props.form) {
        case 'Probe':
            customTheme = createTheme({
                palette: {
                    primary: {
                        main: "#FC930A",
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: "#000",
                    },
                },
            });
            break;
        case 'Incidents':
            customTheme = createTheme({
                palette: {
                    primary: {
                        main: "#4CAF50",
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: "#000",
                    },
                },
            });
            break;
        case 'Detector':
            customTheme = createTheme({
                palette: {
                    primary: {
                        main: "#E73E3A",
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: "#000",
                    },
                },
            });
            break;
        case 'WazeIncident':
            customTheme =  createTheme({
                palette: {
                    primary: {
                        main: "#07B1C6",
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: "#000",
                    },
                },
            });
            break;
        case 'WazeJam':
            customTheme =  createTheme({
                palette: {
                    primary: {
                        main: "#dd2366",
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: "#000",
                    },
                },
            });
            break;
    }
    return (
        <div className=" date-time-div second-step">
            {/* <IonItem color="secondary" className="form-item"> */}
                <div className='form-item-one'>
                    {/* <div>
                        <IonLabel className="form-time-item">{startText}</IonLabel>
                    </div> */}
                    <span>{startText}</span>
                    <span>:</span>
                    <div className='date-time'>
                        <MuiThemeProvider theme={customTheme}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <div>
                        { !includeTime &&<KeyboardDatePicker
                                format="yyyy/MM/dd"
                                minDate="1/1/2009"
                                maxDate={new Date()}
                                value={props.startDate}
                                onChange={props.handleStartDateChange}
                                InputProps={{
                                    disableUnderline: true,
                                }}
                            />}
                            { includeTime && <KeyboardDateTimePicker
                                format="yyyy/MM/dd hh:mm a"
                                minDate="1/1/2009"
                                maxDate={new Date()}
                                value={props.startDate}
                                onChange={props.handleStartDateChange}
                                InputProps={{
                                    disableUnderline: true,
                                }}
                            />}

                            </div>
                        </MuiPickersUtilsProvider>
                        </MuiThemeProvider>
                        
                        
                    </div>
                </div>
            {/* </IonItem> */}
            <div className='form-item-one'>
                <span>{endText}</span>
                <span>:</span>
                <div className='date-time'>
                <MuiThemeProvider theme={customTheme}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <div>
                    { !includeTime && <KeyboardDatePicker
                            format="yyyy/MM/dd"
                            minDate={props.startDate}
                            maxDate={new Date()}
                            value={props.endDate}
                            onChange={props.handleEndDateChange}
                            InputProps={{
                                disableUnderline: true,
                            }}
                        />}
                        { includeTime && <KeyboardDateTimePicker
                            format="yyyy/MM/dd hh:mm a"
                            minDate={props.startDate}
                            maxDate={new Date()}
                            value={props.endDate}
                            onChange={props.handleEndDateChange}
                            InputProps={{
                                disableUnderline: true,
                            }}
                        />}
                       </div>
                    </MuiPickersUtilsProvider>
                </MuiThemeProvider>
                </div>
            </div>
        </div>
    );
};

export default DateTimes;
