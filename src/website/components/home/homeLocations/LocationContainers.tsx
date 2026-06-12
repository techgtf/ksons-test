import React from 'react'
import LocationWiseProjects from './LocatonWiseProjects'
import LocationWiseProjectsMobile from './LocationWiseProjectsMobile'
import { locationProjectsData } from './locationData';


export type LocationData = (typeof locationProjectsData)[0];

export interface ModalHandle {
    /** Slide the panel in and load `data` */
    open: (data: LocationData) => void;
    /** Swap content without any panel animation (location changed while open) */
    swap: (data: LocationData) => void;
    /** Slide the panel out */
    close: () => void;
}
export const LocationContainers = () => {
    return <>
        <LocationWiseProjects />
        <LocationWiseProjectsMobile />

    </>
}
