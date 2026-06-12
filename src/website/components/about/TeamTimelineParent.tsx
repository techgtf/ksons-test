"use client";

import Team, { TeamProps } from "./Team";
import Timeline, { TimelineProps } from "./Timeline";

type TeamTimelineParentProps = {
    teamData: TeamProps;
    timelineData: TimelineProps;
};

export default function TeamTimelineParent({
    teamData,
    timelineData,
}: TeamTimelineParentProps) {
    return (
        <div className="relative bg-[#00305D]">
            <Team {...teamData} />
            <Timeline {...timelineData} />
        </div>
    );
}