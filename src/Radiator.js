import React, { useState, useEffect } from 'react';
import { Table} from 'semantic-ui-react';
import CircleJob from "./CircleJob";
import config from "./config"

const Radiator = () => {
  const [jobsList, setJobsList] = useState({});
  const [hasError, setErrors] = useState(false);

  function pruneIfStagingMostRecent(jobs) {
    let ret=jobs
    const top=jobs[0];
    if (top.workflows) {
      if (top.workflows.workflow_name) {
        if (top.workflows.workflow_name === 'daily-workflow-staging') {
          ret = jobs.shift
        }
      }
    }
    return ret
  }

  async function fetchData() {
    // Keep this request "Simple" as defined in CORS.
    // At the moment it works because the CORS check is bypassed because it's simple
    const res = await fetch(
      "https://circleci.com/api/v1.1/project/gh/YourMD/test-automation-spock?circle-token="+config.circle_token
    )
    res
      .json()
      .then(res => {
        const list = res.splice(1,res.length-1)
        console.log(res)
        setJobsList(res)
      })
      .catch(err => setErrors(err))
  }

  useEffect(() => {
    fetchData()
  },[])

  function safeJob(unsafeJob) {
    let job;
    if (hasError) {
      job = {
        status: "ERROR",
        stop_time: "",
        workflows: { workflow_name: ""},
        build_num: ""
      }

    }
    if (typeof(unsafeJob) === 'undefined') {
      job = {
        status: "waiting",
        stop_time: "",
        workflows: { workflow_name: ""},
        build_num: ""
      }
    } else {
      job = unsafeJob;
    }
    return job;
  }

  function renderJob (unsafeJob, key) {
    let job = safeJob(unsafeJob);
    return (
        <Table.Cell key={key}
          positive={ job.status === "success" ? true : false}
          negative={ job.status !== "success" ? true : false}
        >
          <CircleJob job={job}/>
        </Table.Cell>
    )
  }

  return (
    <Table celled padded>
      <Table.Header>
        <Table.Row>
        <Table.HeaderCell>
            PRODUCTION
          </Table.HeaderCell>          
          <Table.HeaderCell>
            Staging
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
           {[0,1].map( j => renderJob(jobsList[j],j)) }
        </Table.Row>
        <Table.Row>
           {[2,3].map( j => renderJob(jobsList[j],j)) }          
        </Table.Row>
        <Table.Row>
           {[4,5].map( j => renderJob(jobsList[j],j)) }
        </Table.Row>
        <Table.Row>
           {[6,7].map( j => renderJob(jobsList[j],j)) }
        </Table.Row>
        <Table.Row>
           {[8,9].map( j => renderJob(jobsList[j],j)) }
        </Table.Row>
      </Table.Body>
    </Table>
  )
}


export default Radiator;
