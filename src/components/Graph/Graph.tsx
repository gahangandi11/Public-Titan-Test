import './Graph.css';
import { Bar, Line} from 'react-chartjs-2';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonLabel } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { timeOutline } from 'ionicons/icons'
import * as React from 'react';

interface GraphData {
    labels: Array<string>
    series: Array<number>
    graphType: string
    title: string
    subtitle: string
    content: string
    color: string
}

const Graph: React.FC<GraphData> = (props: GraphData) => {
    const data = {
        labels: props.labels,
        datasets: [
            {
                label: props.title,
                backgroundColor: "rgba(255, 255, 255, 0.87)",
                borderColor: "rgba(255, 255, 255, 0.87)",
                data: props.series,
                fill: false,
                lineTension: 0,
                barPercentage: 0.5,
            }
        ]
    };

    const options = {
        scales: {
            legend: {
                display: true,
                color: "rgba(255, 255, 255, 1)"
            },
            xAxes: [{
                gridLines: {
                    color: "rgba(255, 255, 255, .2)",
                    zeroLineColor: "rgba(255, 255, 255, 1)"
                },
                ticks: {
                    fontColor: "rgba(0, 0, 0, 1)"
                }
            }],
            yAxes: [{
                gridLines: {
                    color: "rgba(255, 255, 255, .2)",
                    zeroLineColor: "rgba(255, 255, 255, 1)"
                },
                ticks: {
                    beginAtZero: true,
                    fontColor: "rgba(0, 0, 0, 1)"
                }
            }]
        }
    };

    return (
        <IonCard color="primary" className="graph-card">
            <IonCardContent>
                <div className={props.color}>
                    {(props.graphType === "Bar") && <Bar data={data} options={options} />}
                    {(props.graphType === "Line") && <Line data={data} options={options} />}
                </div>
            </IonCardContent>

            <IonCardHeader>
                <IonCardTitle>{props.title}</IonCardTitle>
                <IonCardSubtitle>{props.subtitle}</IonCardSubtitle>
            </IonCardHeader>
            <div className="rule" />
            <IonCardContent>
                <IonLabel><IonIcon className="icon" md={timeOutline} />{props.content}</IonLabel>
            </IonCardContent>
        </IonCard>
    );
};

export default Graph;
