import Error from "../../components/Error";

const PageNotFound: React.FC = () => {
  return (
    <Error
      title="Oops, page not found..."
      subtitle="Unfortunately, we can't find what you're looking for 😥"
    />
  );
};

export default PageNotFound;
