import { Outlet } from "react-router-dom";
import WorkspaceTabs from "../components/WorkspaceTabs";

export default function Workspace() {
  return (
    <div>
      <WorkspaceTabs />
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
}
