import { Redirect, Route, Switch } from "react-router-dom";
import NewTable from "./NewTable";

function Tables({ handleNewTable }) {
  return (
    <Switch>
      <Route exact={true} path="/tables">
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/tables/new">
        <NewTable handleNewTable={handleNewTable} />
      </Route>
    </Switch>
  )
}

export default Tables;