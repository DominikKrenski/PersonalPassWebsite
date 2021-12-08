import { Route, Redirect } from "react-router";

import sessionService from "../utils/SessionService";

const SecureRoute = ({ children, ...rest }) => {
  return (
    <Route { ...rest } render = { () => {
      if (sessionService.get('refresh_vector') && sessionService.get('private_vector') && sessionService.get('account_id') && sessionService.get('access_vector')) {
        return children;
      }

      return <Redirect to="/signin" />
    }} />
  )
}

export default SecureRoute;
