export type secEdgarEntity = {
  title: string;
  link: {
    rel: string;
    type: string;
    href: string;
  };
  summary: {
    _: string;
    type: string;
  };
  updated: string;
  category: {
    scheme: string;
    label: string;
    term: string;
  };
  id: string;
};
