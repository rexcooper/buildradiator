import React, {Fragment} from 'react';
import { format } from 'date-fns'
import JobTestInfo from './JobTestInfo';

const CircleJob = ({job}) => {
    let status,stop_time,workflow_name, build_num
    let hasJob=false

    status = job.status
    if (status === "waiting") {
        stop_time=""
    } else if (status === "running") {
        stop_time=""
    } else {
        let d = new Date(job.stop_time);
        stop_time=format(d,"yyyy-MM-dd")
        hasJob=true    
    }
    workflow_name=job.workflows.workflow_name
    build_num = job.build_num

    return (
        <div>
            {stop_time}<br />
            (build number: {build_num}) {workflow_name}<br />
            { hasJob ? <JobTestInfo build={job.build_num}/> : <Fragment>Running</Fragment>}
        </div>)
}

export default CircleJob