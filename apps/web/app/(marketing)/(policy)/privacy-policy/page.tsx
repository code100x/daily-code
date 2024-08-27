import { privacyPolicyContent } from "../../../../components/privacy-policy/privacy-policy";

const PrivacyPolicyPage = () => {
  return (
    <main className="flex flex-col items-start justify-center my-16 px-4 max-w-7xl mx-auto gap-4">
      <h1 className="text-3xl md:text-6xl font-bold tracking-tighter w-full text-center mx-auto"> Privacy Policy</h1>
      {privacyPolicyContent.map((item) => {
        return (
          <div className="md:text-lg" key={item.id}>
            <p className="my-2">{item.description}</p>
          </div>
        );
      })}
    </main>
  );
};

export default PrivacyPolicyPage;
