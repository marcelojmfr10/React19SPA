import { useParams } from "react-router";

export const HeroPage = () => {
  const { idSlug = "" } = useParams();

  return <div>hero page</div>;
};
