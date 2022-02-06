import React, { useEffect, useState } from 'react';
import BasicTable from './BasicTable';

import './Display.scss';

/**
 * This is a stateful function component using React Hooks
 */
const Display = ({ loadData, storeData }) => {
  /**
   * if you've used class components before, the useState hook is similar to this code block:
   *
   * constructor(props) {
   *   super(props);
   *   this.state = {
   *     data: []
   *   };
   * }
   *
   * setData is a function used to update data, similar to this.setState({ data: ["my", "new", "data"] })
   */
  const [data, setData] = useState([]);
  const [groupData, setGroupData] = useState([]);


  /**
   * useEffect is a hook used to apply side effects to the component, it can be used for fetching data.
   * similar to componentDidMount and componentDidUpdate, it runs when the component mounts or updates
   *
   * the second argument ([loadData] in this case) is an array of variables that the hook depends on,
   * the hook is only activated if one of those variables change
   */
  useEffect(() => {
    let hasUnmounted = false;

    async function fetchData() {
      const result = await fetch('/api/restaurants')
      const json = await result.json();
      const groupResult = await fetch('/api/restaurants/groups')
      const groupResultJson = await groupResult.json();

      /**
       * since the API request is async, it's possible that the component has unmounted by the time we call setData.
       * calling setData on an unmounted component will cause a warning, so we guard using the bool hasUnmounted
       *
       * a neater solution from Xin: https://github.com/uwblueprint/arbitrium/pull/118
       * ^ this is likely a pattern you want to adopt in your actual projects
       */
      if (!hasUnmounted) {
        setData(json);
        loadData(json);
        if (!!groupResult) {
          console.log(groupResultJson)
          setGroupData(groupResultJson)
        }
      }
    }

    fetchData();

    /* this function is a cleanup function, it always runs when the component unmounts */
    return () => {
      hasUnmounted = true;
    };
  }, [loadData]);


  return (
    <div className="display-container">
      <h2>Local Data Handling</h2>
      <BasicTable data={data} />
      <h2>Global Data Handling</h2>
      <BasicTable  data={storeData} />
      <h2>Restaurant Groups</h2>
      {
        groupData.map(group => {
          return (
            <div>
              <h2>Group {group.name}</h2>
              <p><b>Description: </b>{group.description}</p>
              <BasicTable data={group.restaurants} />
            </div>
          )
        })
      }
    </div>
  );
}

export default Display;

Display.propTypes = {};
