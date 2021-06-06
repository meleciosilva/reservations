import { Redirect, Route, Switch } from "react-router-dom";
import NewTable from "./NewTable";

function Tables() {
  return (
    <Switch>
      <Route exact={true} path="/tables">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/tables/new">
        <NewTable />
      </Route>
    </Switch>
  )
}

export default Tables;