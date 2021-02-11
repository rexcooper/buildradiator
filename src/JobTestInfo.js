import React, { useState, useEffect } from 'react';
import config from "./config";


const JobTestInfo = ({build}) => {

  const [testInfo, setTestInfo] = useState({tests: []});
  const [hasError, setErrors] = useState(false);

  async function fetchBuildData(build) {
    const res = await fetch(
      "https://circleci.com/api/v1.1/project/gh/YourMD/test-automation-spock/"
      +build
      +"/tests?circle-token="+config.circle_token
      )
      res
      .json()
      .then(res => {
        setTestInfo(res)
      })
      .catch(err => setErrors(err))
  }


  useEffect( () => {
      fetchBuildData(build)
    },[build]
  )

  function getSummary(tests) {
    const summary = tests.reduce( (total,current) => {
      if (current.result === "success") {
        total.success = total.success+1
      } else {
        total.fail = total.fail+1
      }
      return total
    },{
      success: 0,
      fail: 0
    })
    return summary
  }

  function renderFails(fails) {
    let details = fails.map( (fail,index) => <li key={index}> {fail.name} </li>)
    return details
  }

  function successFail(tests){
    const summary = getSummary(tests)
    let fails = tests.filter( test => test.result !== 'success')
    return (
      <div>
        Success: {summary.success} Fail: {summary.fail}
        <br/>
        <ul>
          {renderFails(fails)}
        </ul>
      </div>
    )
  }

  return (
    <div>
    {
        (typeof(testInfo.tests[0]) === 'undefined' || hasError)
        ? "undef" 
        : successFail(testInfo.tests)
    }
    </div>
  )

}

export default JobTestInfo;
