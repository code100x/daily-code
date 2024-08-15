import { tncContent } from "../../../components/tnc/tnc-content";

const TermsAndConditionsPage = () => {
  return (
    <main className="flex flex-col items-start justify-center my-16 px-4 max-w-7xl mx-auto gap-4">
      <h1 className="text-3xl md:text-6xl font-bold tracking-tighter w-full text-center mx-auto">Terms & Conditions</h1>
      {tncContent.map((item) => {
        return (
          <div className="my-4 md:text-lg" key={item.id}>
            <p>{item.description}</p>
            {item.points?.map((point) => {
              return (
                <p className="my-2" key={point.id}>
                  {point.id}
                  {". "}
                  {point.description}
                </p>
              );
            })}
          </div>
        );
      })}
    </main>
  );
};

export default TermsAndConditionsPage;
