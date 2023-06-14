import UserData from "./Componets/UserData";
const App = () => {
  const api =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
  return <UserData api={api} />;
};
export default App;
