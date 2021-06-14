import { Redirect, Route, Switch } from "react-router-dom";
import NewTable from "./NewTable";
import ErrorAlert from "../shared/ErrorAlert";

function Tables({ handleNewTable, errors }) {
  return (
    <div>
      <ErrorAlert errors={errors} />
      <Switch>
        <Route exact={true} path="/tables">
          <Redirect to="/dashboard" />
        </Route>
        <Route path="/tables/new">
          <NewTable handleNewTable={handleNewTable} />
        </Route>
      </Switch>
    </div>
  );
}

export default Tables;
