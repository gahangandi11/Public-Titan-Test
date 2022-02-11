export interface TranscoreIncident {
    at_cross_street: string;
    county: string;
    event_class: string;
    event_description: string
    event_lanes_blocked_closedcount: number;
    event_status: string;
    event_time_line_estimated_duration: number;
    event_type: string;
    lane_closed_list: string;
    lane_configuration_list: string;
    latitude: number;
    longitude: number;
    on_street_name: string;
    pub_millis: string;
    request_millis: string;
    uuid: number;
}