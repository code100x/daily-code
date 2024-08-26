import { Suspense } from "react";
import Signin from "../../components/Signin";

const SigninPage = async () => {
  return <Suspense> <Signin /> </Suspense>;
};

export default SigninPage;
